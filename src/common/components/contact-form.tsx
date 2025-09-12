import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CreateContact } from '../entities/contact.entity';
import CustomInput from './custom-input';
import PrimaryButton from './primary-button';

interface ContactFormProps {
  contact: CreateContact;
  onContactChange: (contact: CreateContact) => void;
  onSave: () => void;
  saveButtonTitle?: string;
}

export default function ContactForm({
  contact,
  onContactChange,
  onSave,
  saveButtonTitle = 'Save Contact',
}: ContactFormProps) {
  return (
    <View style={styles.form}>
      <CustomInput
        placeholder="First Name *"
        value={contact.firstName}
        onChangeText={text => onContactChange({ ...contact, firstName: text })}
      />
      <CustomInput
        placeholder="Last Name *"
        value={contact.lastName}
        onChangeText={text => onContactChange({ ...contact, lastName: text })}
      />
      <CustomInput
        placeholder="Email *"
        value={contact.email}
        onChangeText={text => onContactChange({ ...contact, email: text })}
        keyboardType="email-address"
      />
      <CustomInput
        placeholder="Phone"
        value={contact.phone}
        onChangeText={text => onContactChange({ ...contact, phone: text })}
        keyboardType="phone-pad"
      />
      <PrimaryButton title={saveButtonTitle} onPress={onSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    backgroundColor: '#1a1a1a',
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 24,
    borderRadius: 20,
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
});
