import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import {
  Users,
  Plus,
  X,
  Edit3,
  UserPlus,
} from 'lucide-react-native';
import Slider from '@react-native-community/slider';

// Theme constants
import { 
  COLORS, 
  SPACING, 
  BORDER_RADIUS, 
  FONT_SIZES, 
  FONT_WEIGHTS 
} from '../../../common/constants/theme';

// Components
import CustomInput from '../../../common/components/custom-input';

// Types
import { Contact } from '../../../common/entities/contact.entity';
import { SplitType } from '../../../common/entities/bill.entity';

// Local interface for the stepper (more convenient than the main BillParticipant)
interface StepperParticipant {
  contact: Contact;
  amount: number; // This will represent either amount or percentage based on splitType
}

const { width } = Dimensions.get('window');

interface StepTwoParticipantsProps {
  totalAmount: string;
  splitType: SplitType;
  participants: StepperParticipant[];
  setParticipants: (participants: StepperParticipant[]) => void;
  availableContacts: Contact[];
  setAvailableContacts?: (contacts: Contact[]) => void; // Make optional since contacts come from Redux
}

// Contact Selection Modal Component
const ContactSelectionModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onSelectContact: (contact: Contact) => void;
  onCreateNew: (contactData: Omit<Contact, 'id'>) => void;
  existingContacts: Contact[];
  selectedContactIds: string[];
}> = ({
  visible,
  onClose,
  onSelectContact,
  onCreateNew,
  existingContacts,
  selectedContactIds,
}) => {
  const [newContactName, setNewContactName] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateContact = () => {
    if (!newContactName.trim()) {
      Alert.alert('Error', 'Please enter a contact name');
      return;
    }

    const [firstName, ...lastNameParts] = newContactName.trim().split(' ');
    const lastName = lastNameParts.join(' ') || '';

    onCreateNew({
      firstName,
      lastName,
      email: newContactEmail.trim() || '',
      phone: newContactPhone.trim() || '',
    });

    // Reset form
    setNewContactName('');
    setNewContactEmail('');
    setNewContactPhone('');
    setShowCreateForm(false);
  };

  const resetForm = () => {
    setNewContactName('');
    setNewContactEmail('');
    setNewContactPhone('');
    setShowCreateForm(false);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: COLORS.background,
      }}>
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: SPACING.md,
          paddingVertical: SPACING.md,
          backgroundColor: COLORS.cardBackground,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        }}>
          <Text style={{
            fontSize: FONT_SIZES.lg,
            fontWeight: FONT_WEIGHTS.semibold,
            color: COLORS.text,
          }}>
            Select Contact
          </Text>
          <TouchableOpacity onPress={() => { resetForm(); onClose(); }}>
            <X size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1, padding: SPACING.md }}>
          {/* Existing Contacts */}
          {existingContacts.filter(contact => !selectedContactIds.includes(contact.id)).length > 0 && (
            <View style={{ marginBottom: SPACING.lg }}>
              <Text style={{
                fontSize: FONT_SIZES.md,
                fontWeight: FONT_WEIGHTS.semibold,
                color: COLORS.text,
                marginBottom: SPACING.md,
              }}>
                Your Contacts
              </Text>
              
              {existingContacts
                .filter(contact => !selectedContactIds.includes(contact.id))
                .map(contact => (
                  <TouchableOpacity
                    key={contact.id}
                    onPress={() => onSelectContact(contact)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: SPACING.md,
                      paddingHorizontal: SPACING.md,
                      borderRadius: BORDER_RADIUS.md,
                      backgroundColor: COLORS.cardBackground,
                      marginBottom: SPACING.sm,
                      borderWidth: 1,
                      borderColor: COLORS.border,
                    }}
                  >
                    <View style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: COLORS.premium,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: SPACING.md,
                    }}>
                      <Text style={{
                        fontSize: FONT_SIZES.md,
                        fontWeight: FONT_WEIGHTS.bold,
                        color: COLORS.background,
                      }}>
                        {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{
                        fontSize: FONT_SIZES.md,
                        fontWeight: FONT_WEIGHTS.semibold,
                        color: COLORS.text,
                        marginBottom: SPACING.xs,
                      }}>
                        {contact.firstName} {contact.lastName}
                      </Text>
                      <Text style={{
                        fontSize: FONT_SIZES.sm,
                        color: COLORS.textSecondary,
                      }}>
                        {contact.email || contact.phone}
                      </Text>
                    </View>
                    <Plus size={20} color={COLORS.premium} />
                  </TouchableOpacity>
                ))}
            </View>
          )}

          {/* Create New Contact Section */}
          <View>
            <Text style={{
              fontSize: FONT_SIZES.md,
              fontWeight: FONT_WEIGHTS.semibold,
              color: COLORS.text,
              marginBottom: SPACING.md,
            }}>
              Add New Contact
            </Text>

            {showCreateForm ? (
              <View style={{
                backgroundColor: COLORS.cardBackground,
                borderRadius: BORDER_RADIUS.md,
                padding: SPACING.md,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}>
                <CustomInput
                  value={newContactName}
                  onChangeText={setNewContactName}
                  placeholder="Full Name *"
                  style={{ marginBottom: SPACING.sm }}
                />
                <CustomInput
                  value={newContactEmail}
                  onChangeText={setNewContactEmail}
                  placeholder="Email (optional)"
                  keyboardType="email-address"
                  style={{ marginBottom: SPACING.sm }}
                />
                <CustomInput
                  value={newContactPhone}
                  onChangeText={setNewContactPhone}
                  placeholder="Phone (optional)"
                  keyboardType="phone-pad"
                  style={{ marginBottom: SPACING.md }}
                />
                <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
                  <TouchableOpacity
                    onPress={() => setShowCreateForm(false)}
                    style={{
                      flex: 1,
                      paddingVertical: SPACING.md,
                      borderRadius: BORDER_RADIUS.md,
                      borderWidth: 1,
                      borderColor: COLORS.border,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{
                      fontSize: FONT_SIZES.md,
                      fontWeight: FONT_WEIGHTS.medium,
                      color: COLORS.text,
                    }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleCreateContact}
                    style={{
                      flex: 1,
                      paddingVertical: SPACING.md,
                      borderRadius: BORDER_RADIUS.md,
                      backgroundColor: COLORS.premium,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{
                      fontSize: FONT_SIZES.md,
                      fontWeight: FONT_WEIGHTS.semibold,
                      color: COLORS.background,
                    }}>
                      Add Contact
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => setShowCreateForm(true)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: SPACING.lg,
                  borderRadius: BORDER_RADIUS.md,
                  borderWidth: 2,
                  borderColor: COLORS.premium,
                  borderStyle: 'dashed',
                  backgroundColor: COLORS.cardBackground,
                }}
              >
                <UserPlus size={24} color={COLORS.premium} />
                <Text style={{
                  marginLeft: SPACING.sm,
                  fontSize: FONT_SIZES.md,
                  fontWeight: FONT_WEIGHTS.semibold,
                  color: COLORS.premium,
                }}>
                  Create New Contact
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export const StepTwoParticipants: React.FC<StepTwoParticipantsProps> = ({
  totalAmount,
  splitType,
  participants,
  setParticipants,
  availableContacts,
  setAvailableContacts,
}) => {
  const [showContactModal, setShowContactModal] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<number | null>(null);

  // Calculate remaining amount/percentage
  const allocatedValue = participants.reduce((sum, p) => sum + p.amount, 0);
  const totalBillAmount = parseFloat(totalAmount || '0');
  
  // For percentage split, calculate remaining percentage (max 100%)
  // For amount split, calculate remaining amount
  const remainingValue = splitType === 'percentage' 
    ? 100 - allocatedValue 
    : totalBillAmount - allocatedValue;

  // Participant management
  const handleSelectContact = (contact: Contact) => {
    const maxValue = remainingValue;
    if (maxValue <= 0) {
      const limitMessage = splitType === 'percentage' 
        ? 'All 100% has been allocated to participants.' 
        : 'The total bill amount has been fully allocated to participants.';
      Alert.alert('Fully Allocated', limitMessage);
      return;
    }

    // Default amount: for percentage, default to 10% or remaining %, for amount default to $50 or remaining amount
    const defaultValue = splitType === 'percentage' 
      ? Math.min(10, maxValue) 
      : Math.min(50, maxValue);
      
    const newParticipant: StepperParticipant = {
      contact,
      amount: defaultValue,
    };

    setParticipants([...participants, newParticipant]);
    setShowContactModal(false);
  };

  const handleCreateContact = (contactData: Omit<Contact, 'id'>) => {
    const newContact: Contact = {
      ...contactData,
      id: Date.now().toString(), // Simple ID generation
    };
    
    // Only update available contacts if setter is provided
    if (setAvailableContacts) {
      setAvailableContacts([...availableContacts, newContact]);
    }
    handleSelectContact(newContact);
  };

  const handleUpdateParticipantAmount = (index: number, amount: number) => {
    const updatedParticipants = [...participants];
    const otherParticipantsTotal = participants
      .filter((_, i) => i !== index)
      .reduce((sum, p) => sum + p.amount, 0);
    
    const maxForThisParticipant = totalBillAmount - otherParticipantsTotal;
    const clampedAmount = Math.min(Math.max(0, amount), maxForThisParticipant);
    
    updatedParticipants[index].amount = clampedAmount;
    setParticipants(updatedParticipants);
  };

  const handleRemoveParticipant = (index: number) => {
    const updatedParticipants = participants.filter((_, i) => i !== index);
    setParticipants(updatedParticipants);
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: SPACING.md }}>
      <View style={{
        backgroundColor: COLORS.cardBackground,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        marginBottom: SPACING.md,
      }}>
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: SPACING.lg,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Users size={24} color={COLORS.premium} />
            <Text style={{
              fontSize: FONT_SIZES.xl,
              fontWeight: FONT_WEIGHTS.bold,
              color: COLORS.text,
              marginLeft: SPACING.sm,
            }}>
              Add Participants
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowContactModal(true)}
            disabled={remainingValue <= 0}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: SPACING.sm,
              paddingHorizontal: SPACING.md,
              borderRadius: BORDER_RADIUS.md,
              backgroundColor: remainingValue > 0 ? COLORS.premium : COLORS.border,
            }}
          >
            <Plus size={18} color={remainingValue > 0 ? COLORS.background : COLORS.textSecondary} />
            <Text style={{
              marginLeft: SPACING.xs,
              fontSize: FONT_SIZES.sm,
              fontWeight: FONT_WEIGHTS.semibold,
              color: remainingValue > 0 ? COLORS.background : COLORS.textSecondary,
            }}>
              Add
            </Text>
          </TouchableOpacity>
        </View>

        {/* Amount/Percentage Summary */}
        <View style={{
          backgroundColor: COLORS.background,
          borderRadius: BORDER_RADIUS.md,
          padding: SPACING.md,
          marginBottom: SPACING.lg,
          borderLeftWidth: 4,
          borderLeftColor: remainingValue >= 0 ? COLORS.premium : COLORS.error,
        }}>
          <Text style={{
            fontSize: FONT_SIZES.md,
            fontWeight: FONT_WEIGHTS.semibold,
            color: COLORS.text,
            marginBottom: SPACING.sm,
          }}>
            {splitType === 'percentage' ? 'Percentage Allocation' : 'Amount Allocation'}
          </Text>
          
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: SPACING.xs,
          }}>
            <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.textSecondary }}>
              {splitType === 'percentage' ? 'Total:' : 'Total Bill:'}
            </Text>
            <Text style={{ fontSize: FONT_SIZES.sm, fontWeight: FONT_WEIGHTS.semibold, color: COLORS.text }}>
              {splitType === 'percentage' ? '100%' : `$${totalBillAmount.toFixed(2)}`}
            </Text>
          </View>
          
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: SPACING.xs,
          }}>
            <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.textSecondary }}>
              Allocated:
            </Text>
            <Text style={{ fontSize: FONT_SIZES.sm, fontWeight: FONT_WEIGHTS.semibold, color: COLORS.premium }}>
              {splitType === 'percentage' ? `${allocatedValue.toFixed(1)}%` : `$${allocatedValue.toFixed(2)}`}
            </Text>
          </View>
          
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
            <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.textSecondary }}>
              Remaining:
            </Text>
            <Text style={{ 
              fontSize: FONT_SIZES.sm, 
              fontWeight: FONT_WEIGHTS.semibold, 
              color: remainingValue >= 0 ? COLORS.text : COLORS.error 
            }}>
              {splitType === 'percentage' ? `${remainingValue.toFixed(1)}%` : `$${remainingValue.toFixed(2)}`}
            </Text>
          </View>
        </View>

        {/* Participants List */}
        {participants.length > 0 ? (
          <View>
            <Text style={{
              fontSize: FONT_SIZES.md,
              fontWeight: FONT_WEIGHTS.semibold,
              color: COLORS.text,
              marginBottom: SPACING.md,
            }}>
              Participants ({participants.length})
            </Text>
            
            {participants.map((participant, index) => (
              <View
                key={participant.contact.id}
                style={{
                  backgroundColor: COLORS.background,
                  borderRadius: BORDER_RADIUS.md,
                  padding: SPACING.md,
                  marginBottom: SPACING.md,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                }}
              >
                {/* Participant Header */}
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: editingParticipant === index ? SPACING.md : 0,
                }}>
                  <View style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: COLORS.premium,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: SPACING.md,
                  }}>
                    <Text style={{
                      fontSize: FONT_SIZES.md,
                      fontWeight: FONT_WEIGHTS.bold,
                      color: COLORS.background,
                    }}>
                      {participant.contact.firstName.charAt(0)}{participant.contact.lastName.charAt(0)}
                    </Text>
                  </View>
                  
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: FONT_SIZES.md,
                      fontWeight: FONT_WEIGHTS.semibold,
                      color: COLORS.text,
                      marginBottom: SPACING.xs,
                    }}>
                      {participant.contact.firstName} {participant.contact.lastName}
                    </Text>
                    <Text style={{
                      fontSize: FONT_SIZES.lg,
                      fontWeight: FONT_WEIGHTS.bold,
                      color: COLORS.premium,
                    }}>
                      {splitType === 'percentage' 
                        ? `${participant.amount.toFixed(1)}%` 
                        : `$${participant.amount.toFixed(2)}`
                      }
                    </Text>
                    {/* Show calculated amount for percentage split */}
                    {splitType === 'percentage' && (
                      <Text style={{
                        fontSize: FONT_SIZES.sm,
                        color: COLORS.textSecondary,
                        marginTop: 2,
                      }}>
                        ≈ ${((participant.amount / 100) * totalBillAmount).toFixed(2)}
                      </Text>
                    )}
                  </View>
                  
                  <TouchableOpacity
                    onPress={() => setEditingParticipant(editingParticipant === index ? null : index)}
                    style={{
                      padding: SPACING.sm,
                      marginRight: SPACING.sm,
                      borderRadius: BORDER_RADIUS.sm,
                      backgroundColor: editingParticipant === index ? COLORS.premium : COLORS.cardBackground,
                    }}
                  >
                    <Edit3 size={18} color={editingParticipant === index ? COLORS.background : COLORS.premium} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={() => handleRemoveParticipant(index)}
                    style={{
                      padding: SPACING.sm,
                      borderRadius: BORDER_RADIUS.sm,
                      backgroundColor: COLORS.cardBackground,
                    }}
                  >
                    <X size={18} color={COLORS.error} />
                  </TouchableOpacity>
                </View>

                {/* Amount Slider (when editing) */}
                {editingParticipant === index && (
                  <View style={{
                    backgroundColor: COLORS.cardBackground,
                    borderRadius: BORDER_RADIUS.md,
                    padding: SPACING.md,
                  }}>
                    <Text style={{
                      fontSize: FONT_SIZES.sm,
                      fontWeight: FONT_WEIGHTS.medium,
                      color: COLORS.text,
                      marginBottom: SPACING.md,
                      textAlign: 'center',
                    }}>
                      {splitType === 'percentage' 
                        ? `Adjust Percentage: ${participant.amount.toFixed(1)}%`
                        : `Adjust Amount: $${participant.amount.toFixed(2)}`
                      }
                    </Text>
                    
                    <Slider
                      style={{ height: 40 }}
                      minimumValue={0}
                      maximumValue={splitType === 'percentage' 
                        ? 100 - allocatedValue + participant.amount 
                        : totalBillAmount - allocatedValue + participant.amount
                      }
                      value={participant.amount}
                      onValueChange={(value) => handleUpdateParticipantAmount(index, value)}
                      minimumTrackTintColor={COLORS.premium}
                      maximumTrackTintColor={COLORS.border}
                    />
                    
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: SPACING.sm,
                    }}>
                      <Text style={{ fontSize: FONT_SIZES.xs, color: COLORS.textSecondary }}>
                        {splitType === 'percentage' ? '0%' : '$0'}
                      </Text>
                      <Text style={{ fontSize: FONT_SIZES.xs, color: COLORS.textSecondary }}>
                        {splitType === 'percentage' 
                          ? `${(100 - allocatedValue + participant.amount).toFixed(1)}%`
                          : `$${(totalBillAmount - allocatedValue + participant.amount).toFixed(2)}`
                        }
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : (
          // Empty State
          <View style={{
            paddingVertical: SPACING.xxl,
            alignItems: 'center',
          }}>
            <Users size={64} color={COLORS.textSecondary} />
            <Text style={{
              fontSize: FONT_SIZES.lg,
              fontWeight: FONT_WEIGHTS.semibold,
              color: COLORS.text,
              marginTop: SPACING.md,
              textAlign: 'center',
            }}>
              No participants added yet
            </Text>
            <Text style={{
              fontSize: FONT_SIZES.sm,
              color: COLORS.textSecondary,
              marginTop: SPACING.sm,
              textAlign: 'center',
              lineHeight: 20,
            }}>
              {availableContacts.length === 0 
                ? "Tap \"Add\" to create your first contact\nand start splitting bills"
                : "Tap \"Add\" to select from your contacts\nor create a new contact"
              }
            </Text>
          </View>
        )}
      </View>

      {/* Contact Selection Modal */}
      <ContactSelectionModal
        visible={showContactModal}
        onClose={() => setShowContactModal(false)}
        onSelectContact={handleSelectContact}
        onCreateNew={handleCreateContact}
        existingContacts={availableContacts}
        selectedContactIds={participants.map(p => p.contact.id)}
      />
    </ScrollView>
  );
};
