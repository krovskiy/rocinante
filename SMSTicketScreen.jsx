import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
  Animated,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Image,
} from "react-native";

const { width, height } = Dimensions.get("window");
const ChevronRight = ({ size = 8, color = "#fff" }) => (
  <View
    style={{
      width: size,
      height: size * 1.6,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <View
      style={{
        width: size * 0.55,
        height: size * 0.55,
        borderTopWidth: 1.5,
        borderRightWidth: 1.5,
        borderColor: color,
        transform: [{ rotate: "45deg" }, { translateX: -1 }],
      }}
    />
  </View>
);
const BackArrow = () => (
  <View
    style={{
      width: 10,
      height: 16,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <View
      style={{
        width: 9,
        height: 9,
        borderTopWidth: 2,
        borderLeftWidth: 2,
        borderColor: "#fff",
        transform: [{ rotate: "-45deg" }, { translateX: 1 }],
      }}
    />
  </View>
);
const MicIcon = () => (
  <View
    style={{
      width: 16,
      height: 20,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <View
      style={{
        width: 8,
        height: 12,
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: "rgba(255,255,255,0.4)",
        marginBottom: 1,
      }}
    />
    <View
      style={{
        width: 12,
        height: 6,
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        borderWidth: 1.5,
        borderColor: "rgba(255,255,255,0.4)",
        borderBottomWidth: 0,
        marginTop: -1,
      }}
    />
    <View
      style={{
        width: 1.5,
        height: 3,
        backgroundColor: "rgba(255,255,255,0.4)",
        marginTop: 1,
      }}
    />
    <View
      style={{
        width: 6,
        height: 1.5,
        backgroundColor: "rgba(255,255,255,0.4)",
      }}
    />
  </View>
);
const PlusIcon = () => (
  <View
    style={{
      width: 20,
      height: 20,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <View
      style={{
        width: 14,
        height: 2,
        backgroundColor: "rgba(255,255,255,0.85)",
        borderRadius: 1,
        position: "absolute",
      }}
    />
    <View
      style={{
        width: 2,
        height: 14,
        backgroundColor: "rgba(255,255,255,0.85)",
        borderRadius: 1,
        position: "absolute",
      }}
    />
  </View>
);
const Avatar = ({ size = 64 }) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: "#4a4a5a",
      alignItems: "center",
      justifyContent: "flex-end",
      overflow: "hidden",
    }}
  >
    <View
      style={{
        width: size * 0.38,
        height: size * 0.38,
        borderRadius: size * 0.19,
        backgroundColor: "#8a8a9a",
        position: "absolute",
        top: size * 0.15,
      }}
    />

    <View
      style={{
        width: size * 0.7,
        height: size * 0.45,
        borderTopLeftRadius: size * 0.35,
        borderTopRightRadius: size * 0.35,
        backgroundColor: "#8a8a9a",
        marginBottom: -2,
      }}
    />
  </View>
);
const MESSAGES = [
  {
    id: 1,
    type: "sent",
    text: "936",
    time: null,
  },
  {
    id: 2,
    type: "received",
    lines: [
      "IM PUA",
      "Bilet Nr MCA-000091592",
      "12.06.2026 19:25",
      "Pret 7 MDL",
      "Bord 936",
    ],
    time: null,
  },
];
export default function SMSTicketScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 320,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <SafeAreaView style={styles.safeTop}>
        <View style={styles.navbar}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.6}>
            <BackArrow />
            <View style={styles.badgePill}>
              <Text style={styles.badgeText}>58</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navCenter} activeOpacity={0.7}>
            <Avatar size={44} />
            <View style={styles.navNameRow}>
              <Text style={styles.navName}>4000</Text>
              <ChevronRight size={7} color="rgba(255,255,255,0.7)" />
            </View>
          </TouchableOpacity>

          <View style={styles.navRight} />
        </View>

        <View style={styles.smsLabelWrap}>
          <Text style={styles.smsLabel}>Текстовое сообщение · SMS</Text>
          <Text style={styles.smsTime}>Сегодня 19:25</Text>
        </View>
      </SafeAreaView>

      <Animated.ScrollView
        style={[styles.msgList, { opacity: fadeAnim }]}
        contentContainerStyle={styles.msgListContent}
      >
        <Animated.View
          style={[styles.sentRow, { transform: [{ translateY: slideAnim }] }]}
        >
          <View style={styles.sentBubble}>
            <Text style={styles.sentText}>936</Text>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.receivedRow,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.receivedBubble}>
            <Text style={styles.receivedLine}>IM PUA</Text>
            <Text style={styles.receivedLine}>
              {"\n"}Bilet Nr MCA-000091592
            </Text>
            <Text style={styles.receivedLine}>{"\n"}12.06.2026 19:25</Text>
            <Text style={styles.receivedLine}>{"\n"}Pret 7 MDL</Text>
            <Text style={styles.receivedLine}>{"\n"}Bord 936</Text>
          </View>
        </Animated.View>
      </Animated.ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SafeAreaView style={styles.safeBottom}>
          <View style={styles.inputBar}>
            <TouchableOpacity style={styles.plusBtn} activeOpacity={0.7}>
              <PlusIcon />
            </TouchableOpacity>

            <View style={styles.inputField}>
              <TextInput
                style={styles.inputText}
                placeholder="Текстовое сообщение •…"
                placeholderTextColor="rgba(255,255,255,0.35)"
                returnKeyType="send"
              />
              <TouchableOpacity style={styles.micBtn} activeOpacity={0.7}>
                <MicIcon />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
  },
  safeTop: {
    backgroundColor: "#000",
  },
  navbar: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingTop: 4,
    paddingBottom: 6,
    height: 88,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 5,
    minWidth: 70,
  },
  badgePill: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  badgeText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
    fontFamily: Platform.select({ ios: "SF Pro Text", default: "System" }),
  },
  navCenter: {
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  navNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  navName: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    fontFamily: Platform.select({ ios: "SF Pro Text", default: "System" }),
    letterSpacing: -0.2,
  },
  navRight: {
    minWidth: 70,
  },
  smsLabelWrap: {
    alignItems: "center",
    paddingBottom: 10,
    gap: 1,
  },
  smsLabel: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 12,
    fontFamily: Platform.select({ ios: "SF Pro Text", default: "System" }),
    fontWeight: "400",
  },
  smsTime: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 12,
    fontFamily: Platform.select({ ios: "SF Pro Text", default: "System" }),
    fontWeight: "400",
  },
  msgList: {
    flex: 1,
  },
  msgListContent: {
    paddingHorizontal: 8,
    paddingTop: 4,
    paddingBottom: 16,
    gap: 8,
  },
  sentRow: {
    alignItems: "flex-end",
    marginRight: 4,
    marginBottom: 4,
  },
  sentBubble: {
    backgroundColor: "#248A3D", // iOS green iMessage
    borderRadius: 20,
    borderBottomRightRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 9,
    maxWidth: width * 0.72,
    shadowColor: "#34d058",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 3,
  },
  sentText: {
    color: "#fff",
    fontSize: 17,
    fontFamily: Platform.select({ ios: "SF Pro Text", default: "System" }),
    fontWeight: "400",
    lineHeight: 22,
  },
  receivedRow: {
    alignItems: "flex-start",
    marginLeft: 4,
  },
  receivedBubble: {
    backgroundColor: "#1c1c1e",
    borderRadius: 20,
    borderBottomLeftRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: width * 0.78,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.07)",
  },
  receivedLine: {
    color: "#fff",
    fontSize: 17,
    fontFamily: Platform.select({ ios: "SF Pro Text", default: "System" }),
    fontWeight: "400",
    lineHeight: 22,
  },
  safeBottom: {
    backgroundColor: "#000",
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 8,
    borderTopWidth: 0.5,
    borderTopColor: "rgba(255,255,255,0.08)",
  },
  plusBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  inputField: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    paddingLeft: 14,
    paddingRight: 10,
    minHeight: 36,
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.12)",
  },
  inputText: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    fontFamily: Platform.select({ ios: "SF Pro Text", default: "System" }),
    paddingVertical: 6,
  },
  micBtn: {
    padding: 4,
    marginLeft: 4,
  },
});
