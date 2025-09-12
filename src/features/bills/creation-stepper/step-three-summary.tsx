import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import {
  Users,
  DollarSign,
  Percent,
  FileText,
  Calendar,
} from 'lucide-react-native';

// Theme
import {
  COLORS,
  FONT_SIZES,
  FONT_WEIGHTS,
  SPACING,
  BORDER_RADIUS,
} from '../../../common/constants/theme';

// Types
import { Contact } from '../../../common/entities/contact.entity';
import { SplitType } from '../../../common/entities/bill.entity';

// Local interface for the stepper
interface StepperParticipant {
  contact: Contact;
  amount: number; // This represents either amount or percentage based on splitType
}

const { width } = Dimensions.get('window');

interface StepThreeSummaryProps {
  title: string;
  description: string;
  totalAmount: string;
  splitType: SplitType;
  participants: StepperParticipant[];
  currentUser: Contact;
  onCreateBill: () => void;
}

// Generate colors for pie chart
const generateColors = (count: number): string[] => {
  const baseColors = [
    '#FFD700', // Gold
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#96CEB4', // Green
    '#FFEAA7', // Yellow
    '#DDA0DD', // Plum
    '#98D8C8', // Mint
    '#F7DC6F', // Light Yellow
    '#BB8FCE', // Light Purple
  ];
  
  // If we need more colors than available, generate additional ones
  if (count <= baseColors.length) {
    return baseColors.slice(0, count);
  }
  
  const colors = [...baseColors];
  for (let i = baseColors.length; i < count; i++) {
    // Generate additional colors using HSL
    const hue = (i * 137.508) % 360; // Golden angle approximation
    colors.push(`hsl(${hue}, 70%, 65%)`);
  }
  
  return colors;
};

export const StepThreeSummary: React.FC<StepThreeSummaryProps> = ({
  title,
  description,
  totalAmount,
  splitType,
  participants,
  currentUser,
  onCreateBill,
}) => {
  const totalBillAmount = parseFloat(totalAmount || '0');

  // Get current user's amount if they're in participants, or calculate remaining
  const currentUserAsParticipant = participants.find(p => p.contact.id === currentUser.id);
  
  // Calculate remaining amount for current user if not explicitly set
  const otherParticipants = participants.filter(p => p.contact.id !== currentUser.id);
  const otherParticipantsTotal = otherParticipants.reduce((sum, p) => {
    return sum + (splitType === 'percentage' ? (p.amount / 100) * totalBillAmount : p.amount);
  }, 0);
  
  let currentUserAmount = 0;
  if (currentUserAsParticipant) {
    // Current user has manually set amount
    currentUserAmount = splitType === 'percentage' 
      ? (currentUserAsParticipant.amount / 100) * totalBillAmount 
      : currentUserAsParticipant.amount;
  } else {
    // Calculate remaining amount for current user
    currentUserAmount = Math.max(0, totalBillAmount - otherParticipantsTotal);
  }

  let currentUserSplitValue = 0;
  if (currentUserAsParticipant) {
    currentUserSplitValue = currentUserAsParticipant.amount;
  } else {
    // Calculate remaining percentage/amount for display
    if (splitType === 'percentage') {
      const otherParticipantsPercentage = otherParticipants.reduce((sum, p) => sum + p.amount, 0);
      currentUserSplitValue = Math.max(0, 100 - otherParticipantsPercentage);
    } else {
      const otherParticipantsAmount = otherParticipants.reduce((sum, p) => sum + p.amount, 0);
      currentUserSplitValue = Math.max(0, totalBillAmount - otherParticipantsAmount);
    }
  }

  // Create combined participants list with current user first
  const allParticipants = [
    // Current user first
    {
      contact: currentUser,
      amount: currentUserSplitValue,
      actualAmount: currentUserAmount,
      isCurrentUser: true,
    },
    // Other participants
    ...otherParticipants.map(p => ({
      contact: p.contact,
      amount: p.amount,
      actualAmount: splitType === 'percentage' ? (p.amount / 100) * totalBillAmount : p.amount,
      isCurrentUser: false,
    }))
  ];

  // Prepare data for pie chart using all participants
  const chartData = allParticipants.map((participant, index) => {
    const colors = generateColors(allParticipants.length);
    
    return {
      name: participant.isCurrentUser 
        ? 'YOU' 
        : `${participant.contact.firstName} ${participant.contact.lastName}`,
      population: participant.actualAmount,
      color: colors[index],
      legendFontColor: COLORS.text,
      legendFontSize: 12,
    };
  });

  // Calculate totals using all participants
  const totalAllocated = allParticipants.reduce((sum, p) => sum + p.actualAmount, 0);

  const remainingAmount = totalBillAmount - totalAllocated;

  return (
    <ScrollView 
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: SPACING.md }}
      showsVerticalScrollIndicator={false}
    >
      {/* Bill Overview */}
      <View style={{
        backgroundColor: COLORS.background,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.lg,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.premium,
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: SPACING.md,
        }}>
          <FileText size={24} color={COLORS.premium} />
          <Text style={{
            fontSize: FONT_SIZES.xl,
            fontWeight: FONT_WEIGHTS.bold,
            color: COLORS.text,
            marginLeft: SPACING.sm,
          }}>
            Bill Summary
          </Text>
        </View>

        <View style={{ marginBottom: SPACING.md }}>
          <Text style={{
            fontSize: FONT_SIZES.lg,
            fontWeight: FONT_WEIGHTS.bold,
            color: COLORS.text,
            marginBottom: SPACING.xs,
          }}>
            {title}
          </Text>
          {description ? (
            <Text style={{
              fontSize: FONT_SIZES.md,
              color: COLORS.textSecondary,
              lineHeight: 20,
            }}>
              {description}
            </Text>
          ) : null}
        </View>

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: COLORS.cardBackground,
          padding: SPACING.md,
          borderRadius: BORDER_RADIUS.md,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <DollarSign size={20} color={COLORS.premium} />
            <Text style={{
              fontSize: FONT_SIZES.md,
              fontWeight: FONT_WEIGHTS.semibold,
              color: COLORS.text,
              marginLeft: SPACING.xs,
            }}>
              Total Amount
            </Text>
          </View>
          <Text style={{
            fontSize: FONT_SIZES.xl,
            fontWeight: FONT_WEIGHTS.bold,
            color: COLORS.premium,
          }}>
            ${totalBillAmount.toFixed(2)}
          </Text>
        </View>

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: COLORS.cardBackground,
          padding: SPACING.md,
          borderRadius: BORDER_RADIUS.md,
          marginTop: SPACING.sm,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Percent size={20} color={COLORS.premium} />
            <Text style={{
              fontSize: FONT_SIZES.md,
              fontWeight: FONT_WEIGHTS.semibold,
              color: COLORS.text,
              marginLeft: SPACING.xs,
            }}>
              Split Type
            </Text>
          </View>
          <Text style={{
            fontSize: FONT_SIZES.md,
            fontWeight: FONT_WEIGHTS.semibold,
            color: COLORS.text,
            textTransform: 'capitalize',
          }}>
            {splitType}
          </Text>
        </View>
      </View>

      {/* Pie Chart */}
      {allParticipants.length > 0 && (
        <View style={{
          backgroundColor: COLORS.background,
          borderRadius: BORDER_RADIUS.lg,
          padding: SPACING.lg,
          marginBottom: SPACING.lg,
          alignItems: 'center',
        }}>
          <Text style={{
            fontSize: FONT_SIZES.lg,
            fontWeight: FONT_WEIGHTS.bold,
            color: COLORS.text,
            marginBottom: SPACING.lg,
          }}>
            Split Visualization
          </Text>

          <PieChart
            data={chartData}
            width={width - 80}
            height={220}
            chartConfig={{
              backgroundColor: COLORS.background,
              backgroundGradientFrom: COLORS.background,
              backgroundGradientTo: COLORS.background,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            hasLegend={false}
          />
        </View>
      )}

      {/* Participants Grid */}
      <View style={{
        backgroundColor: COLORS.background,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.lg,
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: SPACING.lg,
        }}>
          <Users size={24} color={COLORS.premium} />
          <Text style={{
            fontSize: FONT_SIZES.lg,
            fontWeight: FONT_WEIGHTS.bold,
            color: COLORS.text,
            marginLeft: SPACING.sm,
          }}>
            Participants ({allParticipants.length})
          </Text>
        </View>

        {allParticipants.map((participant, index) => {
          const colors = generateColors(allParticipants.length);

          return (
            <View
              key={`${participant.contact.id}-${index}`}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: SPACING.md,
                paddingHorizontal: SPACING.md,
                backgroundColor: participant.isCurrentUser ? COLORS.premium + '10' : COLORS.cardBackground,
                borderRadius: BORDER_RADIUS.md,
                marginBottom: index < allParticipants.length - 1 ? SPACING.sm : 0,
                borderLeftWidth: 4,
                borderLeftColor: colors[index],
                borderWidth: participant.isCurrentUser ? 2 : 0,
                borderColor: participant.isCurrentUser ? COLORS.premium : 'transparent',
              }}
            >
              <View style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: colors[index],
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
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.xs }}>
                  <Text style={{
                    fontSize: FONT_SIZES.md,
                    fontWeight: FONT_WEIGHTS.semibold,
                    color: COLORS.text,
                    marginRight: SPACING.xs,
                  }}>
                    {participant.contact.firstName} {participant.contact.lastName}
                  </Text>
                  {participant.isCurrentUser && (
                    <View style={{
                      backgroundColor: COLORS.premium,
                      paddingHorizontal: SPACING.xs,
                      paddingVertical: 2,
                      borderRadius: BORDER_RADIUS.sm,
                    }}>
                      <Text style={{
                        fontSize: FONT_SIZES.xs,
                        fontWeight: FONT_WEIGHTS.bold,
                        color: COLORS.background,
                      }}>
                        YOU
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={{
                  fontSize: FONT_SIZES.sm,
                  color: COLORS.textSecondary,
                }}>
                  {participant.contact.email}
                </Text>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{
                  fontSize: FONT_SIZES.lg,
                  fontWeight: FONT_WEIGHTS.bold,
                  color: COLORS.text,
                }}>
                  ${participant.actualAmount.toFixed(2)}
                </Text>
                {splitType === 'percentage' && (
                  <Text style={{
                    fontSize: FONT_SIZES.sm,
                    color: COLORS.textSecondary,
                  }}>
                    {participant.amount.toFixed(1)}%
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>

      {/* Allocation Summary */}
      <View style={{
        backgroundColor: COLORS.background,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.xxl,
        borderLeftWidth: 4,
        borderLeftColor: remainingAmount === 0 ? COLORS.success : COLORS.warning,
      }}>
        <Text style={{
          fontSize: FONT_SIZES.lg,
          fontWeight: FONT_WEIGHTS.bold,
          color: COLORS.text,
          marginBottom: SPACING.md,
        }}>
          Allocation Summary
        </Text>

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: SPACING.sm,
        }}>
          <Text style={{ fontSize: FONT_SIZES.md, color: COLORS.textSecondary }}>
            Total Bill:
          </Text>
          <Text style={{ fontSize: FONT_SIZES.md, fontWeight: FONT_WEIGHTS.semibold, color: COLORS.text }}>
            ${totalBillAmount.toFixed(2)}
          </Text>
        </View>

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: SPACING.sm,
        }}>
          <Text style={{ fontSize: FONT_SIZES.md, color: COLORS.textSecondary }}>
            Allocated:
          </Text>
          <Text style={{ fontSize: FONT_SIZES.md, fontWeight: FONT_WEIGHTS.semibold, color: COLORS.premium }}>
            ${totalAllocated.toFixed(2)}
            {splitType === 'percentage' && (
              <Text style={{ color: COLORS.textSecondary }}>
                {' '}({allParticipants.reduce((sum, p) => sum + p.amount, 0).toFixed(1)}%)
              </Text>
            )}
          </Text>
        </View>

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingTop: SPACING.sm,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
        }}>
          <Text style={{ fontSize: FONT_SIZES.md, color: COLORS.textSecondary }}>
            Remaining:
          </Text>
          <Text style={{ 
            fontSize: FONT_SIZES.md, 
            fontWeight: FONT_WEIGHTS.bold, 
            color: remainingAmount === 0 ? COLORS.success : remainingAmount > 0 ? COLORS.warning : COLORS.error 
          }}>
            ${remainingAmount.toFixed(2)}
          </Text>
        </View>

        {remainingAmount !== 0 && (
          <View style={{
            backgroundColor: remainingAmount > 0 ? COLORS.warning + '20' : COLORS.error + '20',
            padding: SPACING.sm,
            borderRadius: BORDER_RADIUS.sm,
            marginTop: SPACING.md,
          }}>
            <Text style={{
              fontSize: FONT_SIZES.sm,
              color: remainingAmount > 0 ? COLORS.warning : COLORS.error,
              textAlign: 'center',
            }}>
              {remainingAmount > 0 
                ? 'Some amount remains unallocated. You can still create the bill.'
                : 'Total allocation exceeds bill amount. Please adjust participant amounts.'
              }
            </Text>
          </View>
        )}
      </View>

      {/* Create Bill Button */}
      <TouchableOpacity
        onPress={onCreateBill}
        disabled={remainingAmount < 0}
        style={{
          backgroundColor: remainingAmount < 0 ? COLORS.border : COLORS.premium,
          paddingVertical: SPACING.md,
          paddingHorizontal: SPACING.lg,
          borderRadius: BORDER_RADIUS.md,
          alignItems: 'center',
          marginBottom: SPACING.xl,
        }}
      >
        <Text style={{
          fontSize: FONT_SIZES.lg,
          fontWeight: FONT_WEIGHTS.bold,
          color: remainingAmount < 0 ? COLORS.textSecondary : COLORS.background,
        }}>
          Create Bill
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
