export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  Profile: undefined;
  FlashListDemo: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
