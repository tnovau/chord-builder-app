export interface Translations {
  header: {
    subtitle: string;
    tagline: string;
  };
  chordBuilder: {
    identifyChord: string;
    errorMinNotes: string;
    errorNotRecognized: string;
    position: string;
    noPositions: string;
    notes: string;
    intervals: string;
    playing: string;
    playChord: string;
    emptyTitle: string;
    emptyExample: string;
  };
  noteInput: {
    label: string;
    placeholder: string;
    errorInvalidNote: string;
    errorAlreadyAdded: string;
    errorMaxNotes: string;
  };
  auth: {
    login: string;
    register: string;
    email: string;
    password: string;
    name: string;
    confirmPassword: string;
    loginButton: string;
    registerButton: string;
    noAccount: string;
    haveAccount: string;
    loggingIn: string;
    signOut: string;
    registering: string;
    backToHome: string;
    errorPasswordMismatch: string;
    errorPasswordLength: string;
    errorGeneric: string;
  };
}
