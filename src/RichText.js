import React from 'react';
import {
  Button,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {RichEditor, RichToolbar} from 'react-native-pell-rich-editor';
const {height} = Dimensions.get('window');
const pickerOption = (secondaryHeaderColor) => ({
  cropping: Platform.OS === 'android',
  showCropGuidelines: true,
  showCropFrame: true,
  cropperStatusBarColor: secondaryHeaderColor,
  cropperToolbarColor: secondaryHeaderColor,
  freeStyleCropEnabled: true,
});
const style = (inactiveTextColor, primaryHeaderColor) =>
  StyleSheet.create({
    container: {
      backgroundColor: '#ffffff',
      flex: 1,
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: 4,
      marginTop: 4,
      borderColor: inactiveTextColor,
    },
    richText: {
      marginVertical: 8,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    toolbar: {
      backgroundColor: 'white',
      borderColor: 'grey',
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    header: {
      backgroundColor: primaryHeaderColor,
      height: 48 + 24,
      alignItems: 'flex-end',
    },
  });

export default class RichText extends React.Component {
  state = {showLoader: false, isFocused: false, height: 500};

  onEditorInitialized = () => {
    this.setFocusHandlers();
    this.getHTML();
  };

  getHTML = async () => {
    // const titleHtml = await this.richtext.getTitleHtml();
    const contentHtml = await this.richtext.getContentHtml();
    return contentHtml;
    //alert(titleHtml + ' ' + contentHtml)
  };

  setFocusHandlers = () => {
    // this.richtext.setTitleFocusHandler(() => {
    // alert('title focus');
    // });
    this.richtext.setContentFocusHandler(() => {
      // alert('content focus');
      if (!this.state.isFocused) this.setState({isFocused: true});
    });
  };
  onAddImage = async () => {
    if (this.state.isFocused) {
      const image = await ImagePicker.openPicker(
        pickerOption(this.props.secondaryHeaderColor),
      );
      this.uploadProfileImage(image);
    } else alert(this.props.cursorPrompt);
  };
  uploadProfileImage = (picker) => {
    this.setState({showLoader: true});
    const file = this.props.getFile(picker);
    this.props.uploadFile(
      file,
      null,
      {
        progress: (name, status) => {
          console.log(status);
        },
        callback: (name, response, status) => {
          if (status === XMLHttpRequest.DONE) {
            const res = JSON.parse(response);
            const imageSrc = res.path;
            this.richtext.insertImage({
              source: imageSrc,
              src: imageSrc,
            });
            this.setState({showLoader: false});
          }
        },
        error: (error) => {
          alert(error);
        },
      },
      this.props.IMAGE_UPLOAD_URL,
    );
  };

  onHeightChange = (height) => {
    this.setState({height});
  };

  render() {
    const styles = style(
      this.props.inactiveTextColor,
      this.props.primaryHeaderColor,
    );
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        {this.state.showLoader ? <ActivityIndicator /> : null}
        <ScrollView
          keyboardDismissMode="none"
          style={{flex: 1, height: 500}}
          contentContainerStyle={{flex: 1, height: 500}}>
          <RichEditor
            // contentInset={{
            //   top: 0,
            //   left: 0,
            //   bottom: Platform.OS === 'ios' ? 150 : 180,
            //   right: 0,
            // }}
            // hiddenTitle
            onHeightChange={this.handleHeightChange}
            style={{minHeight: 300, flex: 1, height: this.state.height}}
            ref={(r) => (this.richtext = r)}
            // style={[styles.richText, this.props.editorStyle]}
            initialContentHTML={this.props.initialContent || 'rbdvt4vstxgf'}
            editorInitializedCallback={() => this.onEditorInitialized()}
          />
        </ScrollView>
        <RichToolbar
          onPressAddImage={() => this.onAddImage()}
          style={[styles.toolbar, this.props.toolbarStyle]}
          selectedButtonStyle={{
            backgroundColor: this.props.inactiveButtonColor,
          }}
          iconTint="black"
          selectedIconTint="white"
          getEditor={() => this.richtext}
        />
      </View>
    );
  }
}

export const RichTextModal = ({visible, onClose, ...rest}) => {
  const richTextRef = React.createRef();
  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={async () => {
        onClose(await richTextRef.current.getHTML());
      }}>
      <View style={style.header}>
        <SafeAreaView>
          <Button
            mode="text"
            color="white"
            title="Save"
            uppercase={false}
            onPress={async () => onClose(await richTextRef.current.getHTML())}
          />
        </SafeAreaView>
      </View>
      <RichText ref={richTextRef} {...rest} />
    </Modal>
  );
};
