import HomeScreen from "../Screens/HomeScreen/index";
import JournalScreen from "../Screens/JournalScreen/index";
import InsightScreen from "../Screens/InsightScreen/index";
import ProfileScreen from "../Screens/ProfileScreen/index";
import LoginScreen from "../Screens/LoginScreen";
import RegisterScreen from "../Screens/RegisterScreen";
import LandingScreen from "../Screens/LandingScreen";
import RoutineScreen from "../Screens/RoutineScreen";
import MoodMapScreen from "../Screens/MoodMapScreen";

export const routes = [
  {
    name: "Landing",
    component: LandingScreen,
  },
  {
    name: "Home",
    component: HomeScreen,
    icon: { focused: "home", default: "home-outline" },
  },
  {
    name: "Journal",
    component: JournalScreen,
    icon: { focused: "book", default: "book-outline" },
  },
  {
    name: "Insight",
    component: InsightScreen,
    icon: { type: "FontAwesome5", name: "brain" },
  },
  {
    name: "Profile",
    component: ProfileScreen,
    icon: { focused: "person", default: "person-outline" },
  },
  {
    name: "Login",
    component: LoginScreen,
  },
  {
    name: "Register",
    component: RegisterScreen,
  },
  {
    name: "Routine",
    component: RoutineScreen,
  },
  {
    name: "Map",
    component: MoodMapScreen,
  },
];
