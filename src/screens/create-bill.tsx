import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  ChevronRight,
  Check,
} from 'lucide-react-native';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { selectContacts } from '../store/selectors/contactsSelectors';
import { createBill } from '../store/thunks/billsThunks';

// Theme constants
import { 
  COLORS, 
  SPACING, 
  BORDER_RADIUS, 
  FONT_SIZES, 
  FONT_WEIGHTS 
} from '../common/constants/theme';

// Types
import { SplitType } from '../common/entities/bill.entity';
import { Contact } from '../common/entities/contact.entity';

// Components
import { StepOneBillDetails, StepTwoParticipants, StepThreeSummary } from '../features/bills/creation-stepper';

// Local type for participants in the stepper
interface StepperParticipant {
  contact: Contact;
  amount: number;
}

// Navigation types
interface CreateBillScreenProps {
  navigation: any;
  route?: {
    params?: {
      preselectedContacts?: any[];
    };
  };
}

// Step Indicator Component
const StepIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({
  currentStep,
  totalSteps,
}) => {
  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.md,
      backgroundColor: COLORS.cardBackground,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    }}>
      {Array.from({ length: totalSteps }, (_, index) => (
        <React.Fragment key={index}>
          <View style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: index <= currentStep ? COLORS.premium : COLORS.border,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {index < currentStep ? (
              <Check size={16} color={COLORS.background} />
            ) : (
              <Text style={{
                fontSize: FONT_SIZES.sm,
                fontWeight: FONT_WEIGHTS.medium,
                color: index === currentStep ? COLORS.background : COLORS.textSecondary,
              }}>
                {index + 1}
              </Text>
            )}
          </View>
          {index < totalSteps - 1 && (
            <View style={{
              width: 40,
              height: 2,
              backgroundColor: index < currentStep ? COLORS.premium : COLORS.border,
              marginHorizontal: SPACING.xs,
            }} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

export const CreateBillScreen: React.FC<CreateBillScreenProps> = ({ 
  navigation, 
  route 
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  
  // Redux state
  const availableContacts = useSelector(selectContacts);
  
  // Stepper state
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 3;
  
  // Step 1: Bill Details
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [splitType, setSplitType] = useState<SplitType>('amount');

  // Step 2: Participants
  const [participants, setParticipants] = useState<StepperParticipant[]>([]);
  
  // Current user (in real app, this would come from Auth context or Redux)
  const currentUser: Contact = {
    id: 'current-user-id',
    firstName: 'Current',
    lastName: 'User',
    email: 'current.user@example.com',
    phone: '+1234567890',
  };

  // Step navigation validation
  const canProceedToStep2 = title.trim() && totalAmount && parseFloat(totalAmount) > 0;
  
  const canProceedToStep3 = useMemo(() => {
    // Since we now always include the current user, we need at least 2 participants total (current user + 1 other)
    const otherParticipants = participants.filter(p => p.contact.id !== currentUser.id);
    if (otherParticipants.length === 0) return false;
    
    const allocatedValue = otherParticipants.reduce((sum, p) => sum + p.amount, 0);
    
    if (splitType === 'percentage') {
      // For percentage split, other participants should not exceed 100%
      return allocatedValue > 0 && allocatedValue <= 100;
    } else {
      // For amount split, other participants should not exceed bill amount
      return allocatedValue > 0 && allocatedValue <= parseFloat(totalAmount || '0');
    }
  }, [participants, splitType, totalAmount, currentUser.id]);

  const handleCreateBill = async () => {
    try {
      // Filter out current user from participants as they are handled separately as owner
      const otherParticipants = participants.filter(p => p.contact.id !== currentUser.id);
      
      // Check if current user was manually set as a participant
      const currentUserAsParticipant = participants.find(p => p.contact.id === currentUser.id);
      
      // Dispatch the createBill action
      const result = await dispatch(createBill({
        title,
        description,
        totalAmount: parseFloat(totalAmount || '0'),
        splitType,
        participants: otherParticipants,
        owner: currentUser,
        // Pass current user's manual amount if set
        ownerManualAmount: currentUserAsParticipant?.amount,
      })).unwrap();

      Alert.alert(
        'Bill Created Successfully!',
        `Bill "${title}" has been created with ${participants.filter(p => p.contact.id !== currentUser.id).length + 1} participants.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Error Creating Bill',
        error instanceof Error ? error.message : 'Failed to create bill. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleNext = () => {
    if (currentStep === 0 && !canProceedToStep2) {
      Alert.alert('Incomplete Information', 'Please fill in the bill title and total amount to continue.');
      return;
    }
    
    if (currentStep === 1 && !canProceedToStep3) {
      const errorMessage = splitType === 'percentage' 
        ? 'Please add at least one other participant and ensure their total percentage doesn\'t exceed 100%.'
        : 'Please add at least one other participant and ensure their total allocation doesn\'t exceed the bill amount.';
      Alert.alert('Incomplete Information', errorMessage);
      return;
    }
    
    if (currentStep === totalSteps - 1) {
      // On final step, the create button is in the step content
      handleCreateBill();
      return;
    }
    
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepOneBillDetails
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            totalAmount={totalAmount}
            setTotalAmount={setTotalAmount}
            splitType={splitType}
            setSplitType={setSplitType}
          />
        );
      case 1:
        return (
          <StepTwoParticipants
            participants={participants}
            setParticipants={setParticipants}
            availableContacts={availableContacts}
            totalAmount={totalAmount}
            splitType={splitType}
            currentUser={currentUser}
          />
        );
      case 2:
        return (
          <StepThreeSummary
            title={title}
            description={description}
            totalAmount={totalAmount}
            splitType={splitType}
            participants={participants}
            currentUser={currentUser}
            onCreateBill={handleCreateBill}
          />
        );
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 0: return 'Bill Details';
      case 1: return 'Add Participants';
      case 2: return 'Review & Create';
      default: return '';
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: SPACING.md,
          paddingVertical: SPACING.sm,
          backgroundColor: COLORS.cardBackground,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        }}>
          <TouchableOpacity
            onPress={() => currentStep === 0 ? navigation.goBack() : handlePrevious()}
            style={{
              padding: SPACING.xs,
              marginRight: SPACING.sm,
            }}
          >
            <ArrowLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={{
            fontSize: FONT_SIZES.lg,
            fontWeight: FONT_WEIGHTS.semibold,
            color: COLORS.text,
            flex: 1,
          }}>
            {getStepTitle()}
          </Text>
          <Text style={{
            fontSize: FONT_SIZES.sm,
            color: COLORS.textSecondary,
          }}>
            {currentStep + 1} of {totalSteps}
          </Text>
        </View>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

        {/* Step Content */}
        <View style={{ flex: 1 }}>
          {renderStepContent()}
        </View>

        {/* Navigation Buttons */}
        <View style={{
          flexDirection: 'row',
          paddingHorizontal: SPACING.md,
          paddingVertical: SPACING.md,
          backgroundColor: COLORS.cardBackground,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          gap: SPACING.sm,
        }}>
          {currentStep > 0 && (
            <TouchableOpacity
              onPress={handlePrevious}
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: SPACING.md,
                borderRadius: BORDER_RADIUS.md,
                borderWidth: 1,
                borderColor: COLORS.border,
                backgroundColor: COLORS.background,
              }}
            >
              <Text style={{
                fontSize: FONT_SIZES.md,
                fontWeight: FONT_WEIGHTS.medium,
                color: COLORS.text,
              }}>
                Previous
              </Text>
            </TouchableOpacity>
          )}
          
          {currentStep < totalSteps - 1 && (
            <TouchableOpacity
              onPress={handleNext}
              disabled={
                (currentStep === 0 && !canProceedToStep2) ||
                (currentStep === 1 && !canProceedToStep3)
              }
              style={{
                flex: currentStep === 0 ? 1 : 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: SPACING.md,
                borderRadius: BORDER_RADIUS.md,
                backgroundColor: 
                  (currentStep === 0 && !canProceedToStep2) || 
                  (currentStep === 1 && !canProceedToStep3)
                    ? COLORS.border 
                    : COLORS.premium,
              }}
            >
              <Text style={{
                fontSize: FONT_SIZES.md,
                fontWeight: FONT_WEIGHTS.semibold,
                color: 
                  (currentStep === 0 && !canProceedToStep2) || 
                  (currentStep === 1 && !canProceedToStep3)
                    ? COLORS.textSecondary 
                    : COLORS.background,
                marginRight: SPACING.xs,
              }}>
                Next
              </Text>
              <ChevronRight 
                size={20} 
                color={
                  (currentStep === 0 && !canProceedToStep2) || 
                  (currentStep === 1 && !canProceedToStep3)
                    ? COLORS.textSecondary 
                    : COLORS.background
                } 
              />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
