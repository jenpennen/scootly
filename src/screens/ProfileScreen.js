import React, {useState} from 'react'
import {TouchableOpacity, StyleSheet, TextInput, Image, Text, View, FlatList, SafeAreaView, ActivityIndicator} from 'react-native';
import {AppStyles, width, AppIcon} from '../AppStyles';
import {connect, useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-picker';


// TODO:
    // button to change info (not with google)
        // add/change photo
        // change name
    // button to switch between vendor/renter mode

function ProfileScreen(){
    // find current user's data and store the photo
    const auth = useSelector((state) => state.auth);
    const [image, setImage] = useState(null);
    const [userName, changeUserName] = useState('');
    var photo = auth?.user?.photoURL;
    console.log(photo)

    const selectImage = () => {
        const options = {
          maxWidth: 2000,
          maxHeight: 2000,
          storageOptions: {
            skipBackup: true,
            path: 'profileImages'
          }
        };
        ImagePicker.showImagePicker(options, response => {
            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton);
            } else {
              const source = { uri: response.uri };
              console.log(source);
              setImage(source);
            }
          });
        };

    const uploadData = async () => {
        console.log(image);
        const { uri } = image;
        const filename = uri.substring(uri.lastIndexOf('/') + 1);
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        setUploading(true);
        setTransferred(0);
        const task = storage()
          .ref(filename)
          .putFile(uploadUri);
        // set progress state
        task.on('state_changed', snapshot => {
          setTransferred(
            Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
          );
          console.log(Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000);
        });
        try {
          await task;
        } catch (e) {
          console.error(e);
        }
        setUploading(false);
        
        task.snapshot.ref.getDownloadURL().then(downloadURL => {
          //user.updateProfile({ photoURL: downloadURL })
          console.log(downloadURL);
        })
        Alert.alert(
          'Photo uploaded!',
          'Your photo has been uploaded to Firebase Cloud Storage!'
        );
        setImage(null);
    };

    // view with header and profile image, resorts to default if cannot find info
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{auth.user?.fullname ?? 'Stranger'}</Text>
            <View style={styles.profileImageCircle}>
                <TouchableOpacity onPress={()=>selectImage()}>
                <Image
                style={styles.profileImage}
                source={image ? {uri: (image?.uri)} : (AppIcon.images.defaultProfile)}
                />
            </TouchableOpacity>
            </View>
            {/* connect to backend */}
            <View style={styles.InputContainer}>
                <TextInput
                style={styles.body}
                placeholder="Change Name"
                onChangeText={changeUserName}
                value={userName}
                placeholderTextColor={AppStyles.color.white}
                underlineColorAndroid="transparent"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: AppStyles.color.primarybg,
        paddingBottom: 150,
    },
    title: {
        fontSize: AppStyles.fontSize.title,
        fontFamily: AppStyles.fontFamily.bold,
        color: AppStyles.color.white,
        paddingTop: 80,
        marginBottom: 48,
        textAlign: 'center',
    },
    profileImageCircle: {
        width: 200,
        height: 200,
        backgroundColor: AppStyles.color.grey,
        borderRadius: 200 / 2,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        overflow:'hidden'
    },
    profileImage: {
        width: 200,
        height: 200,
        /*tintColor:AppStyles.color.accent,*/
    },
    content: {
        paddingLeft: 50,
        paddingRight: 50,
        textAlign: 'center',
        fontSize: AppStyles.fontSize.content,
        color: AppStyles.color.text,
      },
    body: {
        height: 50,
        paddingLeft: 20,
        paddingRight: 20,
        color: AppStyles.color.text,
        fontFamily: AppStyles.fontFamily.regular,
    },
    InputContainer: {
        width: AppStyles.textInputWidth.main,
        height: 50,
        marginTop: 100,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: AppStyles.color.white,
        borderRadius: AppStyles.borderRadius.main,
      }
});

export default ProfileScreen;