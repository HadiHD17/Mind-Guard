import HomeScreen from "../Screens/HomeScreen/index";
import JournalScreen from "../Screens/JournalScreen/index";
import InsightScreen from "../Screens/InsightScreen/index";
import ProfileScreen from "../Screens/ProfileScreen/index";

export const routes = [
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
];
