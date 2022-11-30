import React, {useLayoutEffect, useState, useEffect} from 'react';
import Button from 'react-native-button';
import {View, StyleSheet, Text, TextInput, Image, TouchableOpacity, ActivityIndicator, Alert} from 'react-native';
import {connect, useSelector} from 'react-redux';
import {AppStyles, AppIcon} from '../AppStyles';
import {Configuration} from '../Configuration';
import { Icon } from 'react-native-elements'
import ImagePicker from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import NumericInput from 'react-native-numeric-input'
import { DayPicker } from 'react-native-picker-weekday'
import {SelectList} from 'react-native-dropdown-select-list'


function AddVehicleScreen({navigation}) {
  const auth = useSelector((state) => state.auth);
  const [vehicleName, setVehicleName] = useState('');
  const [vehicleDescription, setVehicleDescription] = useState('');
  const [hourlyRate, setHourlyRate] = useState(0);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [currentScreen, setCurrentScreen] = useState(true);
  const [weekdays, setWeekdays] = React.useState([-1]);
  const [startSelected, setSSelected] = React.useState('10:00 AM');
    const [endSelected, setESelected] = React.useState('10:00 PM');
    const timeData = [
        {key:'1', value:'12:00 AM'},
        {key:'2', value:'01:00 AM'},
        {key:'3', value:'02:00 AM'},
        {key:'4', value:'03:00 AM'},
        {key:'5', value:'04:00 AM'},
        {key:'6', value:'05:00 AM'},
        {key:'7', value:'06:00 AM'},
        {key:'8', value:'07:00 AM'},
        {key:'9', value:'08:00 AM'},
        {key:'10', value:'09:00 AM'},
        {key:'11', value:'10:00 AM'},
        {key:'12', value:'11:00 AM'},
        {key:'13', value:'12:00 PM'},
        {key:'14', value:'01:00 PM'},
        {key:'15', value:'02:00 PM'},
        {key:'16', value:'03:00 PM'},
        {key:'17', value:'04:00 PM'},
        {key:'18', value:'05:00 PM'},
        {key:'19', value:'06:00 PM'},
        {key:'20', value:'07:00 PM'},
        {key:'21', value:'08:00 PM'},
        {key:'22', value:'09:00 PM'},
        {key:'23', value:'10:00 PM'},
        {key:'24', value:'11:00 PM'},
    ];

  const selectImage = () => {
    const options = {
      maxWidth: 2000,
      maxHeight: 2000,
      storageOptions: {
        skipBackup: true,
        path: 'vehicleImages'
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
      //console.log(Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000);
    });
    try {
      await task;
    } catch (e) {
      console.error(e);
    }

    task.snapshot.ref.getDownloadURL().then(downloadURL => {
      //user.updateProfile({ photoURL: downloadURL })
      //console.log(downloadURL);
      firestore()
      .collection('rentals')
      .add({
        vehicleImage: downloadURL,
        hourlyRate: hourlyRate,
        vehicleName: vehicleName,
        vehicleDescription, vehicleDescription,
        availableDays: weekdays,
        availability: startSelected + ' - ' + endSelected,
        vendorUID: auth.user?.id
      })
      .then(() => {
        setUploading(false);
        //console.log('Listing added!');
        navigation.navigate('VendorHome', {refreshKey: Math.random()});
      });
    })
    /*
    Alert.alert(
      'Photo uploaded!',
      'Your photo has been uploaded to Firebase Cloud Storage!'
    );
    */
    setImage(null);
  };

  return (
    currentScreen ? 
    (<View style={styles.container}>
      <View style={{
            paddingHorizontal: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
        }}>
          <Icon style={styles.backArrow} type="ionicon" name="arrow-back-outline" color={AppStyles.color.accent} size={27} onPress={() => navigation.navigate('VendorHome')}></Icon>
          <Text style={styles.title}>Add a Vehicle</Text>
      </View>
      <TouchableOpacity onPress={()=>selectImage()}>
        <Image
          style={styles.vehicleImage}
          source={image ? {uri: (image?.uri)} : (AppIcon.images.defaultVehicle)}
        />
      </TouchableOpacity>
      <View style={styles.InputContainer}>
        <TextInput
          style={styles.body}
          placeholder="Vehicle Name"
          onChangeText={setVehicleName}
          value={vehicleName}
          placeholderTextColor={AppStyles.color.white}
          underlineColorAndroid="transparent"
        />
      </View>
      <View style={styles.InputContainer}>
        <TextInput
          style={styles.description}
          placeholder="Description"
          multiline={true}
          onChangeText={setVehicleDescription}
          value={vehicleDescription}
          placeholderTextColor={AppStyles.color.white}
          underlineColorAndroid="transparent"
        />
      </View>
      <Button
        containerStyle={styles.addVehicleContainer}
        style={styles.addVehicleText}
        onPress={() => setCurrentScreen(false)}>
        Next
      </Button>
  </View>):
  (<View style={styles.container}>
    <View style={{
          paddingHorizontal: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center"
      }}>
        <Icon style={styles.backArrow} type="ionicon" name="arrow-back-outline" color={AppStyles.color.accent} size={27} onPress={() => setCurrentScreen(true)}></Icon>
        <Text style={styles.title}>Add a Vehicle</Text>
    </View>
    <Text style={styles.body}>Hourly Rate</Text>
    <NumericInput 
            value={hourlyRate} 
            type={'up-down'}
            onChange={setHourlyRate} 
            minValue={0}
            onLimitReached={(isMax,msg) => console.log(isMax,msg)}
            totalWidth={240} 
            totalHeight={50} 
            valueType='integer'
            rounded 
            textColor={AppStyles.color.text}  />

  <Text style={styles.availability}>Availability</Text>
  <DayPicker
      weekdays={weekdays}
      setWeekdays={setWeekdays}
      activeColor={AppStyles.color.tint}
      textColor={AppStyles.color.primarybg}
      inactiveColor={AppStyles.color.secondarytext}
    />
    <SelectList
        data={timeData}
        setSelected={(val) => setSSelected(val)}
        save="value"
        dropdownTextStyles={{color:AppStyles.color.accent}}
        placeholder="Select Start Time"
    />
    <Text style={styles.availability}>To</Text>
    <SelectList
        data={timeData}
        setSelected={(val) => setESelected(val)}
        save="value"
        style={[styles.dropdown]}
        boxStyles={{color:AppStyles.color.accent}}
        dropdownTextStyles={{color:AppStyles.color.accent}}
        placeholder="Select End Time"
    />
    <Button
      containerStyle={styles.addVehicleContainer}
      style={styles.addVehicleText}
      onPress={uploadData}>
      Done
    </Button>
    {uploading &&
    <View style={styles.loading}>
      <ActivityIndicator size='large' />
    </View>
    }
  </View>)
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppStyles.color.primarybg,
    alignItems: 'center',
  },
  title: {
    paddingTop: 80,
    fontSize: AppStyles.fontSize.title,
    fontFamily: AppStyles.fontFamily.bold,
    color: AppStyles.color.white,
    marginBottom: 80,
    alignItems: 'auto',
    paddingRight: 80
  },
  backArrow: {
    marginRight: 70,
    paddingBottom: 0
  },
  InputContainer: {
    width: AppStyles.textInputWidth.main,
    marginTop: 30,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: AppStyles.color.white,
    borderRadius: AppStyles.borderRadius.main,
  },
  body: {
    height: 40,
    paddingLeft: 20,
    paddingRight: 20,
    color: AppStyles.color.text,
    fontFamily: AppStyles.fontFamily.regular,
  },
  availability: {
    marginTop: 20,
    marginBottom: 0,
    paddingLeft: 20,
    paddingRight: 20,
    color: AppStyles.color.text,
  },
  description: {
    height: 140,
    paddingLeft: 20,
    paddingRight: 20,
    color: AppStyles.color.text,
  },
  addVehicleContainer: {
    position: 'absolute',
    bottom:50,
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.tint,
    borderRadius: AppStyles.borderRadius.main,
    padding: 10,
    marginTop: 30,
  },
  addVehicleText: {
    color: AppStyles.color.primarybg,
  },
  availabilityButtonContainer: {
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.tint,
    borderRadius: AppStyles.borderRadius.main,
    padding: 10,
    marginTop: 10,
  },
  availabilityButtonText: {
    color: AppStyles.color.primarybg,
  },
  vehicleImage: {
    width: 240,
    height: 240,
    borderRadius: 24,
    marginBottom: 24
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.5,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(AddVehicleScreen);
