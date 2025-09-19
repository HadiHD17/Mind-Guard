// Mock for @expo/vector-icons
const React = require("react");

const MockIcon = (props) => {
  return React.createElement("Text", props, props.name || "icon");
};

module.exports = {
  Ionicons: MockIcon,
  MaterialIcons: MockIcon,
  FontAwesome: MockIcon,
  AntDesign: MockIcon,
  Entypo: MockIcon,
  EvilIcons: MockIcon,
  Feather: MockIcon,
  Foundation: MockIcon,
  MaterialCommunityIcons: MockIcon,
  Octicons: MockIcon,
  SimpleLineIcons: MockIcon,
  Zocial: MockIcon,
};
