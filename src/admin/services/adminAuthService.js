const MOCK_CREDENTIALS = {
  email: "admin@luxora.com",
  password: "admin123",
};

const TOKEN_KEY = "luxora_admin_token";

export const loginAdmin = (email, password, rememberMe = false) => {
  if (
    email.toLowerCase() === MOCK_CREDENTIALS.email &&
    password === MOCK_CREDENTIALS.password
  ) {
    const token = "mock-admin-jwt-token-xyz";
    if (rememberMe) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      sessionStorage.setItem(TOKEN_KEY, token);
    }
    return true;
  }
  return false;
};

export const logoutAdmin = () => {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
};

export const isAdminAuthenticated = () => {
  return (
    localStorage.getItem(TOKEN_KEY) !== null ||
    sessionStorage.getItem(TOKEN_KEY) !== null
  );
};
