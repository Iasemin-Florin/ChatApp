import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useChatClient } from './useChatClients';
import { Channel, Chat, OverlayProvider } from 'stream-chat-react-native';
import { StreamChat } from 'stream-chat';
import { ChannelList, MessageList, MessageInput } from 'stream-chat-react-native';
import { chatApiKey, chatUserId } from './chatConfig';

const Stack = createStackNavigator();

const filters = {
  members: {
    '$in': [chatUserId]
  }
}

const sort = {
  last_message_at: -1 
};

const ChannelScreen = props => {
  const { route } = props;
  const { params: { channel } } = route;

  return (
    <Channel channel={channel}>
      <MessageList />
      <MessageInput />
    </Channel>
  );
};

const ChannelListScreen = props => {
  return (
    <ChannelList
      onSelect={(channel) => {
      const { navigation } = props;
      navigation.navigate('ChannelScreen', { channel });
    }}
    />
  );
};

const chatClient = StreamChat.getInstance(chatApiKey);

const NavigationStack = () => {
  const { clientIsReady } = useChatClient();

  if (!clientIsReady) {
    return <Text>Loading Chat...</Text>
  }
  
  return (
    <OverlayProvider>
      <Chat client={chatClient}>
      <Stack.Navigator>
        <Stack.Screen name="Groups" component={ChannelListScreen} />
        <Stack.Screen name="ChannelScreen" component={ChannelScreen} />
      </Stack.Navigator>

      </Chat>
    </OverlayProvider>
    
  );
};

export default () => {
  
  return (
    <GestureHandlerRootView style={{ flex: 1}}>
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
          <NavigationStack />
        </NavigationContainer>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};
