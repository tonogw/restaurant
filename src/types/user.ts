export interface EndUser {
  name: string; //min length 2
  email: string; //($email)
  phone: string;
  password: string; //min length 6
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      name: string;
      email: string;
      phone: string;
      avatar: string;
    };
    token: string;
  };
}

export interface AuthCardProps {
  title: string;
  subtitle: string;
  activeTab: "login" | "register";
  children: React.ReactNode;
}
