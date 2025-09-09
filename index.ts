import { registerRootComponent } from 'expo';
import './src/i18n'; // Initialize i18n before anything else

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
