import React from 'react';
import {
  Appearance,
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
} from 'react-native';
import {
  actions,
  defaultActions,
  RichToolbar,
} from 'react-native-pell-rich-editor';
import {InsertLinkModal} from './insertLink';
import {EmojiView} from './emoji';
import RichTextEditor from './RichEditor';

const phizIcon = require('./assets/phiz.png');
const htmlIcon = require('./assets/h5.png');
const videoIcon = require('./assets/video.png');
const strikethrough = require('./assets/strikethrough.png');

class Example extends React.Component {
  richText = React.createRef();
  linkModal = React.createRef();

  constructor(props) {
    super(props);
    const theme = props.theme || Appearance.getColorScheme();
    const contentStyle = this.createContentStyle(theme);
    this.state = {theme: theme, contentStyle, emojiVisible: false, height: 200};
  }

  componentDidMount() {
    Appearance.addChangeListener(this.themeChange);
    Keyboard.addListener('keyboardDidShow', this.onKeyBoard);
  }

  componentWillUnmount() {
    Appearance.removeChangeListener(this.themeChange);
    Keyboard.removeListener('keyboardDidShow', this.onKeyBoard);
  }

  onKeyBoard = () => {
    TextInput.State.currentlyFocusedInput() &&
      this.setState({emojiVisible: false});
  };

  editorInitializedCallback = () => {
    this.richText.current?.registerToolbar((items) => {
      console.log(
        'Toolbar click, selected items (insert end callback):',
        items,
      );
    });
  };

  /**
   * theme change to editor color
   * @param colorScheme
   */
  themeChange = ({colorScheme}) => {
    const theme = colorScheme;
    const contentStyle = this.createContentStyle(theme);
    this.setState({theme, contentStyle});
  };

  save = async () => {
    // Get the data here and call the interface to save the data
    let html = await this.richText.current?.getContentHtml();
    // console.log(html);
    alert(html);
  };

  /**
   * editor change data
   * @param {string} html
   */
  handleChange = (html) => {
    // console.log('editor data:', html);
  };

  /**
   * editor height change
   * @param {number} height
   */
  handleHeightChange = (height) => {
    this.setState({height});
    console.log('editor height change:', height);
  };

  insertEmoji = (emoji) => {
    this.richText.current?.insertText(emoji);
    this.setState({emojiVisible: false});
    this.richText.current?.blurContentEditor();
  };

  handleEmoji = () => {
    const {emojiVisible} = this.state;
    Keyboard.dismiss();
    this.richText.current?.blurContentEditor();
    this.setState({emojiVisible: !emojiVisible});
  };

  insertVideo = () => {
    this.richText.current?.insertVideo(
      'https://mdn.github.io/learning-area/html/multimedia-and-embedding/video-and-audio-content/rabbit320.mp4',
    );
  };

  insertHTML = () => {
    this.richText.current?.insertHTML(
      `<span style="color: blue; padding:0 10px;">HTML</span>`,
    );
  };

  onPressAddImage = () => {
    // insert URL
    this.richText.current?.insertImage(
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/100px-React-icon.svg.png',
    );
    // insert base64
    // this.richText.current?.insertImage(`data:${image.mime};base64,${image.data}`);
    // this.richText.current?.blurContentEditor();
  };

  onInsertLink = () => {
    // this.richText.current?.insertLink('Google', 'http://google.com');
    this.linkModal.current?.setModalVisible(true);
  };

  onLinkDone = ({title, url}) => {
    this.richText.current?.insertLink(title, url);
  };

  onHome = () => {
    this.props.navigation.push('index');
  };

  createContentStyle = (theme) => {
    // Can be selected for more situations (cssText or contentCSSText).
    const contentStyle = {
      backgroundColor: '#000033',
      color: '#fff',
      placeholderColor: 'gray',
      // cssText: '#editor {background-color: #f3f3f3}', // initial valid
      contentCSSText: 'font-size: 16px; min-height: 200px; height: 100%;', // initial valid
    };
    if (theme === 'light') {
      contentStyle.backgroundColor = '#fff';
      contentStyle.color = '#000033';
      contentStyle.placeholderColor = '#a9a9a9';
    }
    return contentStyle;
  };

  onTheme = () => {
    let {theme} = this.state;
    theme = theme === 'light' ? 'dark' : 'light';
    let contentStyle = this.createContentStyle(theme);
    this.setState({theme, contentStyle});
  };

  render() {
    let that = this;
    const {contentStyle, theme, emojiVisible} = that.state;
    const {backgroundColor, color, placeholderColor} = contentStyle;
    const themeBg = {backgroundColor};
    return (
      //   <SafeAreaView style={[styles.container, themeBg]}>
      //     <StatusBar
      //       barStyle={theme !== 'dark' ? 'dark-content' : 'light-content'}
      //       translucent
      //     />
      <View>
        <InsertLinkModal
          placeholderColor={placeholderColor}
          color={color}
          backgroundColor={backgroundColor}
          onDone={that.onLinkDone}
          ref={that.linkModal}
        />
        {/* <ScrollView
          contentContainerStyle={{flex: 1}}
          style={[styles.scroll, themeBg, {marginTop: 36}]}
          keyboardDismissMode={'none'}> */}
        {/* <View style={styles.nav}>
            <Button title={'HOME'} onPress={that.onHome} />
            <Button title={theme} onPress={that.onTheme} />
            <Button title="Save" onPress={that.save} />
          </View> */}
        {/* <View>
            <View style={styles.item}>
              <Text style={{color}}>To: </Text>
              <TextInput
                style={[styles.input, {color}]}
                placeholderTextColor={placeholderColor}
                placeholder={'stulip@126.com'}
              />
            </View>
            <View style={styles.item}>
              <Text style={{color}}>Subject: </Text>
              <TextInput
                style={[styles.input, {color}]}
                placeholderTextColor={placeholderColor}
                placeholder="Rich Editor Bug 😀"
              />
            </View>
          </View> */}
        <KeyboardAvoidingView
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 100}
          style={{flexGrow: 1}}
          enabled
          behavior={Platform.OS === 'android' ? undefined : 'padding'}>
          <RichTextEditor
            // initialFocus={true}
            editorStyle={contentStyle} // default light style
            containerStyle={themeBg}
            ref={that.richText}
            style={[
              themeBg,
              {
                height: this.state.height,
                marginBottom: 36,
                marginTop: 24,
                // minHeight: Dimensions.get('window').height,
              },
            ]}
            scrollEnabled
            placeholder={'please input content'}
            // initialContentHTML={initHTML}
            editorInitializedCallback={that.editorInitializedCallback}
            onChange={that.handleChange}
            onHeightChange={that.handleHeightChange}
          />
        </KeyboardAvoidingView>
        {/* </ScrollView> */}
        {/* <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}> */}
        <RichToolbar
          style={[styles.richBar, themeBg, {position: 'absolute'}]}
          editor={that.richText}
          iconTint={color}
          selectedIconTint={'white'}
          selectedButtonStyle={{
            backgroundColor: this.props.inactiveButtonColor,
          }}
          onPressAddImage={that.onPressAddImage}
          onInsertLink={that.onInsertLink}
          iconSize={40} // default 50
          actions={[
            'insertVideo',
            ...defaultActions,
            actions.setStrikethrough,
            actions.heading1,
            actions.heading4,
            'insertEmoji',
            'insertHTML',
          ]} // default defaultActions
          iconMap={{
            insertEmoji: phizIcon,
            [actions.setStrikethrough]: strikethrough,
            [actions.heading1]: <Text style={styles.tib}>H1</Text>,
            [actions.heading4]: <Text style={styles.tib}>H3</Text>,
            insertHTML: htmlIcon,
            insertVideo: videoIcon,
          }}
          insertEmoji={that.handleEmoji}
          insertHTML={that.insertHTML}
          insertVideo={that.insertVideo}
        />
        {emojiVisible && (
          <View style={{backgroundColor: 'black', flex: 1, marginTop: 36}}>
            <EmojiView onSelect={that.insertEmoji} />
          </View>
        )}
        {/* </KeyboardAvoidingView> */}
      </View>
      //   </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 5,
  },
  rich: {
    minHeight: 300,
    flex: 1,
  },
  richBar: {
    height: 50,
    backgroundColor: '#F5FCFF',
  },
  scroll: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  item: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#e8e8e8',
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    paddingHorizontal: 15,
  },

  input: {
    flex: 1,
  },

  tib: {
    textAlign: 'center',
    color: '#515156',
  },
});

export default Example;
