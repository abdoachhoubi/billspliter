import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  FileText,
  DollarSign,
  Percent,
} from 'lucide-react-native';

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
import { SplitType } from '../../../common/entities/bill.entity';

interface StepOneBillDetailsProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  totalAmount: string;
  setTotalAmount: (amount: string) => void;
  splitType: SplitType;
  setSplitType: (type: SplitType) => void;
}

export const StepOneBillDetails: React.FC<StepOneBillDetailsProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  totalAmount,
  setTotalAmount,
  splitType,
  setSplitType,
}) => {
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
          marginBottom: SPACING.lg,
        }}>
          <FileText size={24} color={COLORS.premium} />
          <Text style={{
            fontSize: FONT_SIZES.xl,
            fontWeight: FONT_WEIGHTS.bold,
            color: COLORS.text,
            marginLeft: SPACING.sm,
          }}>
            Bill Details
          </Text>
        </View>

        {/* Bill Title */}
        <View style={{ marginBottom: SPACING.md }}>
          <Text style={{
            fontSize: FONT_SIZES.md,
            fontWeight: FONT_WEIGHTS.semibold,
            color: COLORS.text,
            marginBottom: SPACING.sm,
          }}>
            Bill Title *
          </Text>
          <CustomInput
            value={title}
            onChangeText={setTitle}
            placeholder="Enter bill title (e.g., Dinner at Restaurant)"
            style={{
              backgroundColor: COLORS.background,
              borderWidth: 1,
              borderColor: title.trim() ? COLORS.premium : COLORS.border,
            }}
          />
        </View>

        {/* Description */}
        <View style={{ marginBottom: SPACING.md }}>
          <Text style={{
            fontSize: FONT_SIZES.md,
            fontWeight: FONT_WEIGHTS.semibold,
            color: COLORS.text,
            marginBottom: SPACING.sm,
          }}>
            Description (Optional)
          </Text>
          <CustomInput
            value={description}
            onChangeText={setDescription}
            placeholder="Add any additional details..."
            multiline
            numberOfLines={3}
            style={{
              backgroundColor: COLORS.background,
              borderWidth: 1,
              borderColor: COLORS.border,
              minHeight: 80,
              textAlignVertical: 'top',
            }}
          />
        </View>

        {/* Total Amount */}
        <View style={{ marginBottom: SPACING.lg }}>
          <Text style={{
            fontSize: FONT_SIZES.md,
            fontWeight: FONT_WEIGHTS.semibold,
            color: COLORS.text,
            marginBottom: SPACING.sm,
          }}>
            Total Amount *
          </Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: COLORS.background,
            borderRadius: BORDER_RADIUS.md,
            borderWidth: 1,
            borderColor: totalAmount && parseFloat(totalAmount) > 0 ? COLORS.premium : COLORS.border,
            paddingHorizontal: SPACING.md,
          }}>
            <Text style={{
              fontSize: FONT_SIZES.lg,
              fontWeight: FONT_WEIGHTS.semibold,
              color: COLORS.textSecondary,
              marginRight: SPACING.xs,
            }}>
              $
            </Text>
            <CustomInput
              value={totalAmount}
              onChangeText={setTotalAmount}
              placeholder="0.00"
              keyboardType="numeric"
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                borderWidth: 0,
                fontSize: FONT_SIZES.lg,
                fontWeight: FONT_WEIGHTS.semibold,
              }}
            />
          </View>
          {totalAmount && parseFloat(totalAmount) > 0 && (
            <Text style={{
              fontSize: FONT_SIZES.sm,
              color: COLORS.premium,
              marginTop: SPACING.xs,
            }}>
              Total: ${parseFloat(totalAmount).toFixed(2)}
            </Text>
          )}
        </View>

        {/* Split Type Selection */}
        <View>
          <Text style={{
            fontSize: FONT_SIZES.md,
            fontWeight: FONT_WEIGHTS.semibold,
            color: COLORS.text,
            marginBottom: SPACING.sm,
          }}>
            Split Type
          </Text>
          <Text style={{
            fontSize: FONT_SIZES.sm,
            color: COLORS.textSecondary,
            marginBottom: SPACING.md,
          }}>
            Choose how you want to split the bill
          </Text>

          <View style={{
            flexDirection: 'row',
            backgroundColor: COLORS.background,
            borderRadius: BORDER_RADIUS.md,
            padding: SPACING.xs,
            gap: SPACING.xs,
          }}>
            {/* Amount Split Option */}
            <TouchableOpacity
              onPress={() => setSplitType('amount')}
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: SPACING.md,
                paddingHorizontal: SPACING.sm,
                borderRadius: BORDER_RADIUS.sm,
                backgroundColor: splitType === 'amount' ? COLORS.premium : 'transparent',
              }}
            >
              <DollarSign 
                size={18} 
                color={splitType === 'amount' ? COLORS.background : COLORS.text} 
              />
              <View style={{ marginLeft: SPACING.sm }}>
                <Text style={{
                  fontSize: FONT_SIZES.sm,
                  fontWeight: FONT_WEIGHTS.semibold,
                  color: splitType === 'amount' ? COLORS.background : COLORS.text,
                }}>
                  Fixed Amount
                </Text>
                <Text style={{
                  fontSize: FONT_SIZES.xs,
                  color: splitType === 'amount' ? COLORS.background : COLORS.textSecondary,
                }}>
                  Exact dollar amounts
                </Text>
              </View>
            </TouchableOpacity>

            {/* Percentage Split Option */}
            <TouchableOpacity
              onPress={() => setSplitType('percentage')}
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: SPACING.md,
                paddingHorizontal: SPACING.sm,
                borderRadius: BORDER_RADIUS.sm,
                backgroundColor: splitType === 'percentage' ? COLORS.premium : 'transparent',
              }}
            >
              <Percent 
                size={18} 
                color={splitType === 'percentage' ? COLORS.background : COLORS.text} 
              />
              <View style={{ marginLeft: SPACING.sm }}>
                <Text style={{
                  fontSize: FONT_SIZES.sm,
                  fontWeight: FONT_WEIGHTS.semibold,
                  color: splitType === 'percentage' ? COLORS.background : COLORS.text,
                }}>
                  Percentage
                </Text>
                <Text style={{
                  fontSize: FONT_SIZES.xs,
                  color: splitType === 'percentage' ? COLORS.background : COLORS.textSecondary,
                }}>
                  Percentage based
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Split Type Info */}
          <View style={{
            marginTop: SPACING.md,
            padding: SPACING.md,
            backgroundColor: COLORS.background,
            borderRadius: BORDER_RADIUS.md,
            borderLeftWidth: 4,
            borderLeftColor: COLORS.premium,
          }}>
            <Text style={{
              fontSize: FONT_SIZES.sm,
              fontWeight: FONT_WEIGHTS.medium,
              color: COLORS.text,
              marginBottom: SPACING.xs,
            }}>
              {splitType === 'amount' ? 'Fixed Amount Split' : 'Percentage Split'}
            </Text>
            <Text style={{
              fontSize: FONT_SIZES.xs,
              color: COLORS.textSecondary,
              lineHeight: 18,
            }}>
              {splitType === 'amount' 
                ? 'Each participant will pay a specific dollar amount that you assign. Great for when some people ordered more expensive items.'
                : 'Each participant will pay a percentage of the total bill. Perfect for equal or proportional splits.'
              }
            </Text>
          </View>
        </View>
      </View>

      {/* Validation Summary */}
      {(title.trim() || totalAmount || description.trim()) && (
        <View style={{
          backgroundColor: COLORS.cardBackground,
          borderRadius: BORDER_RADIUS.lg,
          padding: SPACING.md,
          borderWidth: 1,
          borderColor: (title.trim() && totalAmount && parseFloat(totalAmount) > 0) 
            ? COLORS.premium 
            : COLORS.border,
        }}>
          <Text style={{
            fontSize: FONT_SIZES.md,
            fontWeight: FONT_WEIGHTS.semibold,
            color: COLORS.text,
            marginBottom: SPACING.sm,
          }}>
            Summary
          </Text>
          
          <View style={{ gap: SPACING.xs }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.textSecondary }}>
                Title:
              </Text>
              <Text style={{ 
                fontSize: FONT_SIZES.sm, 
                color: title.trim() ? COLORS.text : COLORS.error,
                fontWeight: FONT_WEIGHTS.medium,
              }}>
                {title.trim() || 'Required'}
              </Text>
            </View>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.textSecondary }}>
                Amount:
              </Text>
              <Text style={{ 
                fontSize: FONT_SIZES.sm, 
                color: (totalAmount && parseFloat(totalAmount) > 0) ? COLORS.premium : COLORS.error,
                fontWeight: FONT_WEIGHTS.semibold,
              }}>
                {(totalAmount && parseFloat(totalAmount) > 0) 
                  ? `$${parseFloat(totalAmount).toFixed(2)}` 
                  : 'Required'
                }
              </Text>
            </View>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.textSecondary }}>
                Split Type:
              </Text>
              <Text style={{ 
                fontSize: FONT_SIZES.sm, 
                color: COLORS.text,
                fontWeight: FONT_WEIGHTS.medium,
              }}>
                {splitType === 'amount' ? 'Fixed Amount' : 'Percentage'}
              </Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};
