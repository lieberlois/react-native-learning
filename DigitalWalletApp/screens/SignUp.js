import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  TextInput,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {COLORS, SIZES, FONTS, icons, images} from '../constants';

const Header = () => {
  return (
    <TouchableOpacity
      style={styles.touchableOpacity}
      onPress={() => console.log('Signup')}>
      <Image source={icons.back} resizeMode="contain" style={styles.icon} />
      <Text style={styles.signupText}>Sign Up</Text>
    </TouchableOpacity>
  );
};

const Logo = () => {
  return (
    <View style={styles.logo}>
      <Image
        source={images.wallieLogo}
        resizeMode="contain"
        style={styles.logoImage}
      />
    </View>
  );
};

const Form = ({setModalVisible, selectedArea}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.form}>
      {/* Full Name */}
      <View style={styles.formFullName}>
        <Text style={styles.formText}>Full Name</Text>
        <TextInput
          style={styles.formNameInput}
          placeholder="Enter Full Name"
          placeholderTextColor={COLORS.white}
          selectionColor={COLORS.white}
        />
      </View>

      {/* Phone Number */}
      <View style={styles.formPhone}>
        <Text style={styles.formText}>Phone Number</Text>
        <View style={styles.formPhoneInputView}>
          <TouchableOpacity
            style={styles.formPhoneButton}
            onPress={() => {
              setModalVisible(true);
            }}>
            <View style={styles.center}>
              <Image source={icons.down} style={styles.formDownArrowIcon} />
            </View>
            <View style={styles.formFlagContainer}>
              <Image
                source={{uri: selectedArea?.flag}}
                resizeMode="contain"
                style={styles.formFlag}
              />
            </View>
            <View style={styles.formFlagContainer}>
              <Text style={styles.formCountryCodeText}>
                {selectedArea?.callingCode}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Phone Number Input */}
          <TextInput
            style={styles.formNumberInput}
            placeholder="Enter Phone Number"
            placeholderTextColor={COLORS.white}
            selectionColor={COLORS.white}
          />
        </View>
      </View>

      {/* Password */}
      <View style={styles.formPasswordView}>
        <Text style={styles.formText}>Password</Text>
        <TextInput
          style={styles.formPasswordInput}
          placeholder="Enter Password"
          placeholderTextColor={COLORS.white}
          selectionColor={COLORS.white}
          secureTextEntry={showPassword === false}
        />
        <TouchableOpacity
          style={styles.formPasswordEye}
          onPress={() => setShowPassword((show) => !show)}>
          <Image
            source={showPassword ? icons.disable_eye : icons.eye}
            style={styles.formEyeIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ContinueButtton = () => {
  return (
    <View style={styles.continueView}>
      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => console.log('Navigate to home')}>
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const CountryModal = ({areas, visible, setModalVisible, setSelectedArea}) => {
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.countryModalItem}
        onPress={() => {
          setSelectedArea(item);
          setModalVisible(false);
        }}>
        <Image source={{uri: item.flag}} style={styles.countrySelectorFlag} />
        <Text style={styles.countrySelectorText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={styles.modalStyle}>
          <View style={styles.modalStyleInner}>
            <FlatList
              data={areas}
              renderItem={renderItem}
              keyExtractor={(item) => item.code}
              showsVerticalScrollIndicator={false}
              style={styles.countrySelector}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const SignUp = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);

  useEffect(() => {
    const getCountries = async () => {
      const data = await fetch('https://restcountries.eu/rest/v2/all');
      const json = await data.json();
      const areaData = json.map((item) => {
        return {
          code: item.alpha2Code,
          name: item.name,
          callingCode: `+${item.callingCodes[0]}`,
          flag: `https://www.countryflags.io/${item.alpha2Code}/flat/64.png`,
        };
      });

      setAreas(areaData);
      if (areaData.length > 0) {
        const def = areaData.filter((a) => a.code === 'DE');
        if (def.length > 0) {
          setSelectedArea(def[0]);
        }
      }
    };
    getCountries();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={styles.flex}>
      <LinearGradient
        colors={[COLORS.lime, COLORS.emerald]}
        style={styles.flex}>
        <ScrollView>
          {/* keyboardShouldPersistTaps={true}> */}
          <Header />
          <Logo />
          <Form setModalVisible={setModalVisible} selectedArea={selectedArea} />
          <ContinueButtton />
        </ScrollView>
      </LinearGradient>
      <CountryModal
        visible={modalVisible}
        setModalVisible={setModalVisible}
        areas={areas}
        setSelectedArea={setSelectedArea}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
  },
  touchableOpacity: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.padding * 2,
    paddingHorizontal: SIZES.padding * 2,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: COLORS.white,
  },
  signupText: {
    marginLeft: SIZES.padding * 1.5,
    color: COLORS.white,
    ...FONTS.h4,
  },
  logo: {
    marginTop: SIZES.padding * 3,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: '60%',
  },
  form: {
    marginTop: SIZES.padding * 3,
    marginHorizontal: SIZES.padding * 3,
  },
  formFullName: {
    marginTop: SIZES.padding * 2,
  },
  formNameInput: {
    marginVertical: SIZES.padding,
    borderBottomColor: COLORS.white,
    borderBottomWidth: 1,
    height: 40,
    color: COLORS.white,
    ...FONTS.body3,
  },
  formPhone: {
    marginTop: SIZES.padding * 2,
  },
  formPhoneInputView: {
    flexDirection: 'row',
  },
  formDownArrowIcon: {
    width: 10,
    height: 10,
    tintColor: COLORS.white,
  },
  formPhoneButton: {
    width: 100,
    height: 50,
    marginHorizontal: 5,
    borderBottomColor: COLORS.white,
    borderBottomWidth: 1,
    flexDirection: 'row',
    ...FONTS.body3,
  },
  formFlagContainer: {
    justifyContent: 'center',
    marginLeft: 10,
  },
  formFlag: {
    width: 30,
    height: 30,
  },
  formCountryCodeText: {
    color: COLORS.white,
    ...FONTS.body3,
  },
  formText: {
    color: COLORS.lightGreen,
    ...FONTS.body3,
  },
  formNumberInput: {
    flex: 1,
    marginVertical: SIZES.padding,
    borderBottomColor: COLORS.white,
    borderBottomWidth: 1,
    height: 40,
    color: COLORS.white,
    ...FONTS.body3,
  },
  formPasswordView: {
    marginTop: SIZES.padding * 2,
  },
  formPasswordInput: {
    marginVertical: SIZES.padding,
    borderBottomColor: COLORS.white,
    borderBottomWidth: 1,
    height: 40,
    color: COLORS.white,
    ...FONTS.body3,
  },
  formPasswordEye: {
    position: 'absolute',
    right: 0,
    bottom: 10,
    height: 30,
    width: 30,
  },
  formEyeIcon: {
    height: 20,
    width: 20,
    tintColor: COLORS.white,
  },
  continueView: {
    margin: SIZES.padding * 4,
  },
  continueButton: {
    height: 60,
    backgroundColor: COLORS.black,
    borderRadius: SIZES.radius / 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    color: COLORS.white,
    ...FONTS.h3,
  },
  modalStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalStyleInner: {
    height: 400,
    width: SIZES.width * 0.8,
    backgroundColor: COLORS.lightGreen,
    borderRadius: SIZES.radius,
  },
  countrySelector: {
    padding: SIZES.padding * 2,
    marginBottom: SIZES.padding * 2,
  },
  countryModalItem: {
    padding: SIZES.padding,
    flexDirection: 'row',
  },
  countrySelectorFlag: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  countrySelectorText: {
    ...FONTS.body4,
  },
});

export default SignUp;
