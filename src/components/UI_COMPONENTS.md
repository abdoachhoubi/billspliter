# UI Components Library

A comprehensive collection of reusable UI components for the Bill Splitter React Native app. All components are built with TypeScript, support theming (dark/light mode), and follow modern design principles.

## Components Overview

### 1. Button
A versatile button component with multiple variants, sizes, and states.

```tsx
import { Button } from '../components';

<Button 
  title="Primary Button"
  onPress={() => console.log('pressed')}
  variant="primary"
  size="medium"
  loading={false}
  disabled={false}
  fullWidth={false}
/>
```

**Props:**
- `title` (string): Button text
- `onPress` (function): Press handler
- `variant` ('primary' | 'secondary' | 'danger'): Visual style
- `size` ('small' | 'medium' | 'large'): Button size
- `disabled` (boolean): Disabled state
- `loading` (boolean): Loading state with spinner
- `fullWidth` (boolean): Full width styling

### 2. Input
A flexible text input component with labels, icons, and validation states.

```tsx
import { Input } from '../components';

<Input
  label="Email"
  placeholder="Enter your email"
  value={email}
  onChangeText={setEmail}
  error={emailError}
  helperText="We'll never share your email"
  leftIcon={<EmailIcon />}
  rightIcon={<ClearIcon />}
  variant="outlined"
  size="medium"
  required={true}
/>
```

**Props:**
- `label` (string): Input label
- `error` (string): Error message
- `helperText` (string): Helper text below input
- `leftIcon` / `rightIcon` (ReactNode): Icon components
- `variant` ('default' | 'outlined' | 'filled'): Input style
- `size` ('small' | 'medium' | 'large'): Input size
- `required` (boolean): Required field indicator

### 3. Card
A container component for grouping related content with elevation and styling options.

```tsx
import { Card } from '../components';

<Card
  variant="elevated"
  padding="medium"
  borderRadius="medium"
  onPress={() => console.log('card pressed')}
>
  <Text>Card content here</Text>
</Card>
```

**Props:**
- `variant` ('default' | 'elevated' | 'outlined'): Visual style
- `padding` ('none' | 'small' | 'medium' | 'large'): Internal padding
- `margin` ('none' | 'small' | 'medium' | 'large'): External margin
- `borderRadius` ('none' | 'small' | 'medium' | 'large' | 'full'): Corner radius
- `onPress` (function): Optional press handler

### 4. Avatar
User avatar component supporting images, initials, and various sizes.

```tsx
import { Avatar } from '../components';

<Avatar
  source={{ uri: 'https://example.com/avatar.jpg' }}
  name="John Doe"
  size="large"
  variant="circle"
  showBadge={true}
  badgeColor="#10b981"
  onPress={() => console.log('avatar pressed')}
/>
```

**Props:**
- `source` (ImageSource): Image source
- `name` (string): Name for initials fallback
- `size` ('small' | 'medium' | 'large' | 'xlarge' | number): Avatar size
- `variant` ('circle' | 'rounded' | 'square'): Shape
- `showBadge` (boolean): Show status badge
- `badgeColor` (string): Badge color

### 5. ListItem
A flexible list item component for displaying structured information.

```tsx
import { ListItem } from '../components';

<ListItem
  title="List Item Title"
  subtitle="Subtitle text"
  description="Longer description text that provides more context"
  leftElement={<Avatar name="JD" size="medium" />}
  rightElement={<ChevronIcon />}
  onPress={() => console.log('item pressed')}
  variant="card"
  selected={false}
/>
```

**Props:**
- `title` (string): Primary text
- `subtitle` (string): Secondary text
- `description` (string): Tertiary text
- `leftElement` / `rightElement` (ReactNode): Custom elements
- `variant` ('default' | 'card'): Visual style
- `selected` (boolean): Selected state
- `divider` (boolean): Show bottom divider

### 6. FAB (Floating Action Button)
A floating action button for primary actions.

```tsx
import { FAB } from '../components';

<FAB
  onPress={() => console.log('fab pressed')}
  icon={<PlusIcon />}
  label="Add Bill"
  size="medium"
  variant="primary"
  position="bottom-right"
/>
```

**Props:**
- `icon` (ReactNode): Icon component
- `label` (string): Optional text label
- `size` ('small' | 'medium' | 'large'): Button size
- `variant` ('primary' | 'secondary' | 'surface'): Visual style
- `position` ('bottom-right' | 'bottom-left' | 'bottom-center' | 'custom'): Position

### 7. Badge
A small status indicator that can wrap other components.

```tsx
import { Badge } from '../components';

<Badge count={5} variant="error" size="medium">
  <Avatar name="JD" />
</Badge>

// Or standalone
<Badge count={10} variant="primary" maxCount={99} />
```

**Props:**
- `count` (number): Number to display
- `maxCount` (number): Maximum count before showing "+"
- `variant` ('default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error'): Color scheme
- `size` ('small' | 'medium' | 'large'): Badge size
- `dot` (boolean): Show as dot instead of number

### 8. Chip
A compact element for displaying tags, categories, or selected items.

```tsx
import { Chip } from '../components';

<Chip
  label="Filter Tag"
  onPress={() => console.log('chip pressed')}
  onDelete={() => console.log('chip deleted')}
  variant="filled"
  color="primary"
  selected={true}
  leftIcon={<TagIcon />}
/>
```

**Props:**
- `label` (string): Chip text
- `variant` ('filled' | 'outlined' | 'ghost'): Visual style
- `color` ('default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error'): Color scheme
- `selected` (boolean): Selected state
- `leftIcon` / `rightIcon` (ReactNode): Icon components
- `onDelete` (function): Delete handler

### 9. Divider
A visual separator between content sections.

```tsx
import { Divider } from '../components';

<Divider 
  orientation="horizontal"
  variant="solid"
  text="OR"
  textPosition="center"
  margin={16}
/>
```

**Props:**
- `orientation` ('horizontal' | 'vertical'): Direction
- `variant` ('solid' | 'dashed' | 'dotted'): Line style
- `text` (string): Optional text overlay
- `textPosition` ('left' | 'center' | 'right'): Text alignment
- `thickness` (number): Line thickness

### 10. Switch
A toggle switch component for boolean settings.

```tsx
import { Switch } from '../components';

<Switch
  value={isEnabled}
  onValueChange={setIsEnabled}
  label="Enable notifications"
  description="Receive push notifications for new bills"
  size="medium"
  color="#3b82f6"
/>
```

**Props:**
- `value` (boolean): Switch state
- `onValueChange` (function): Change handler
- `label` (string): Switch label
- `description` (string): Description text
- `size` ('small' | 'medium' | 'large'): Switch size
- `color` (string): Active color

### 11. Checkbox
A checkbox component for multiple selections.

```tsx
import { Checkbox } from '../components';

<Checkbox
  checked={isChecked}
  onPress={() => setIsChecked(!isChecked)}
  label="Accept terms"
  description="I agree to the terms and conditions"
  size="medium"
  indeterminate={someSelected}
/>
```

**Props:**
- `checked` (boolean): Checked state
- `onPress` (function): Press handler
- `label` (string): Checkbox label
- `description` (string): Description text
- `indeterminate` (boolean): Indeterminate state
- `size` ('small' | 'medium' | 'large'): Checkbox size

### 12. RadioButton & RadioGroup
Radio button components for single selection from multiple options.

```tsx
import { RadioButton, RadioGroup } from '../components';

// Single radio button
<RadioButton
  selected={selectedValue === 'option1'}
  onPress={() => setSelectedValue('option1')}
  label="Option 1"
  value="option1"
/>

// Radio group
<RadioGroup
  value={selectedValue}
  onValueChange={setSelectedValue}
>
  <RadioButton label="Option 1" value="option1" />
  <RadioButton label="Option 2" value="option2" />
  <RadioButton label="Option 3" value="option3" />
</RadioGroup>
```

**RadioButton Props:**
- `selected` (boolean): Selected state
- `onPress` (function): Press handler
- `label` (string): Radio label
- `value` (string): Radio value
- `size` ('small' | 'medium' | 'large'): Radio size

**RadioGroup Props:**
- `value` (string): Currently selected value
- `onValueChange` (function): Change handler
- `children` (RadioButton[]): Radio button children

## Theme Support

All components automatically adapt to the current theme (light/dark mode) through the `useTheme` hook. Colors, backgrounds, and text colors adjust accordingly.

## Accessibility

Components include proper accessibility features:
- Semantic roles and labels
- Touch target sizing (minimum 44px)
- Screen reader support
- Keyboard navigation support
- High contrast support

## Usage Examples

### Creating a Form
```tsx
import { Card, Input, Button, Switch, Checkbox } from '../components';

const FormExample = () => {
  const [email, setEmail] = useState('');
  const [notifications, setNotifications] = useState(false);
  const [terms, setTerms] = useState(false);

  return (
    <Card variant="outlined" padding="large">
      <Input
        label="Email Address"
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        required
      />
      
      <Switch
        value={notifications}
        onValueChange={setNotifications}
        label="Email Notifications"
        description="Receive updates about your bills"
      />
      
      <Checkbox
        checked={terms}
        onPress={() => setTerms(!terms)}
        label="I accept the terms and conditions"
      />
      
      <Button
        title="Submit"
        onPress={() => console.log('Submit')}
        variant="primary"
        fullWidth
        disabled={!terms}
      />
    </Card>
  );
};
```

### Creating a User List
```tsx
import { ListItem, Avatar, Badge, Divider } from '../components';

const UserList = () => {
  const users = [
    { id: '1', name: 'John Doe', email: 'john@example.com', bills: 3 },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', bills: 1 },
  ];

  return (
    <Card>
      {users.map((user, index) => (
        <React.Fragment key={user.id}>
          <ListItem
            title={user.name}
            subtitle={user.email}
            leftElement={<Avatar name={user.name} size="medium" />}
            rightElement={
              <Badge count={user.bills} variant="primary" size="small" />
            }
            onPress={() => console.log('User pressed:', user.id)}
          />
          {index < users.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </Card>
  );
};
```

## Best Practices

1. **Consistent Sizing**: Use the predefined size props (small, medium, large) for consistent spacing
2. **Theme Colors**: Let components use theme colors automatically rather than hardcoding colors
3. **Accessibility**: Always provide labels and descriptions for screen readers
4. **Touch Targets**: Ensure interactive elements are at least 44px for proper touch targets
5. **Loading States**: Use loading props for async operations
6. **Error Handling**: Provide clear error messages and validation states

## Contributing

When adding new components:
1. Follow the existing patterns and TypeScript interfaces
2. Support both light and dark themes
3. Include proper accessibility features
4. Add comprehensive prop documentation
5. Export from the main index file
6. Update this documentation
