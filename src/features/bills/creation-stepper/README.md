# Bill Creation Stepper

This feature implements a multi-step bill creation process that guides users through creating bills with proper validation and user experience.

## Structure

```
src/features/bills/creation-stepper/
├── index.ts                    # Export file for all stepper components
├── step-one-bill-details.tsx   # First step: Basic bill information
├── step-two-participants.tsx   # Second step: Participant selection (TODO)
└── step-three-summary.tsx      # Third step: Review and confirmation (TODO)
```

## Step One: Bill Details

The first step (`StepOneBillDetails`) collects:

### Required Fields
- **Bill Title**: A descriptive name for the bill
- **Total Amount**: The total amount to be split

### Optional Fields
- **Description**: Additional details about the bill

### Split Type Selection
- **Fixed Amount**: Each participant pays a specific dollar amount
- **Percentage**: Each participant pays a percentage of the total

## Features

### Smart Validation
- Real-time validation feedback
- Visual indicators for required fields
- Summary section showing current state

### Enhanced UX
- Clear visual hierarchy with icons
- Contextual help text explaining split types
- Responsive design with proper spacing

### Integration
- Works seamlessly with the main stepper navigation
- Proper TypeScript typing for all props
- Follows app's design system and theme

## Usage

```tsx
import { StepOneBillDetails } from '../features/bills/creation-stepper';

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
```

## Next Steps

1. **Step Two**: Implement participant selection with contact management and amount allocation sliders
2. **Step Three**: Create summary view with pie chart visualization and final review
3. **Enhancement**: Add form persistence and validation improvements
