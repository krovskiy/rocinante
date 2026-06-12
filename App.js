import React, { useState, useRef, useEffect } from "react";
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
} from "react-native";

const { width } = Dimensions.get("window");
const FONT = Platform.select({ ios: "SF Pro Text", default: "System" });

const ChevronRight = ({ size = 8, color = "rgba(255,255,255,0.45)" }) => (
  <View
    style={{
      width: size + 4,
      height: size * 1.8,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <View
      style={{
        width: size * 0.6,
        height: size * 0.6,
        borderTopWidth: 1.8,
        borderRightWidth: 1.8,
        borderColor: color,
        transform: [{ rotate: "45deg" }],
      }}
    />
  </View>
);

const BackArrow = ({ color = "#fff" }) => (
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
        borderColor: color,
        transform: [{ rotate: "-45deg" }, { translateX: 1 }],
      }}
    />
  </View>
);

const Avatar = ({ size = 46 }) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: "#3a3a4a",
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
        backgroundColor: "#7a7a8a",
        position: "absolute",
        top: size * 0.14,
      }}
    />
    <View
      style={{
        width: size * 0.72,
        height: size * 0.46,
        borderTopLeftRadius: size * 0.36,
        borderTopRightRadius: size * 0.36,
        backgroundColor: "#7a7a8a",
        marginBottom: -2,
      }}
    />
  </View>
);

const MicIcon = () => (
  <View
    style={{
      width: 18,
      height: 22,
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
        width: 13,
        height: 7,
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
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
        width: 7,
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
const HamburgerIcon = () => (
  <View style={{ width: 20, height: 14, justifyContent: "space-between" }}>
    {[0, 1, 2].map((i) => (
      <View
        key={i}
        style={{
          width: i === 2 ? 14 : 20,
          height: 2,
          backgroundColor: "#fff",
          borderRadius: 1,
        }}
      />
    ))}
  </View>
);
const CloudIcon = () => (
  <View
    style={{
      width: 52,
      height: 52,
      borderRadius: 12,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <View
      style={{
        width: 30,
        height: 18,
        backgroundColor: "#5AC8FA",
        borderRadius: 9,
        marginTop: 4,
      }}
    />
    <View
      style={{
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: "#5AC8FA",
        position: "absolute",
        top: 10,
        left: 8,
      }}
    />
    <View
      style={{
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "#5AC8FA",
        position: "absolute",
        top: 8,
        right: 8,
      }}
    />
    <View
      style={{
        width: 30,
        height: 10,
        backgroundColor: "#5AC8FA",
        position: "absolute",
        bottom: 10,
      }}
    />
  </View>
);
const CONVERSATIONS = [
  {
    id: "4002",
    name: "4002",
    preview1: "Plată cu succes!",
    preview2: "7 MDL achitați către Parcul Urban de Aut…",
    time: "19:26",
    unread: false,
  },
  {
    id: "4000",
    name: "4000",
    preview1: "IM PUA",
    preview2: null,
    time: "19:26",
    unread: false,
  },
  {
    id: "moldcell",
    name: "Moldcell",
    preview1:
      "Ai reîncărcat contul cu 10.00 lei. Soldul actual: 10.51 lei. Instalează aplicația my",
    preview2: null,
    time: "19:25",
    unread: true,
  },
  {
    id: "moldcell",
    name: "Moldcell",
    preview1:
      "Ai reîncărcat contul cu 10.00 lei. Soldul actual: 10.51 lei. Instalează aplicația my…",
    preview2: null,
    time: "19:25",
    unread: true,
  },
];
function MessagesListScreen({ onOpen }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 260,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[ls.root, { opacity: fadeAnim }]}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
        <View style={ls.topBar}>
          <TouchableOpacity style={ls.editBtn} activeOpacity={0.7}>
            <Text style={ls.editText}>Править</Text>
          </TouchableOpacity>
          <TouchableOpacity style={ls.menuBtn} activeOpacity={0.7}>
            <HamburgerIcon />
          </TouchableOpacity>
        </View>

        <Text style={ls.largeTitle}>Сообщения</Text>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={ls.contactBanner} activeOpacity={0.8}>
            <Avatar size={46} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={ls.contactBannerName}>Dumitru Ciobanu</Text>
              <Text style={ls.contactBannerSub}>
                Доступ к Вашему имени и фото
              </Text>
            </View>
            <ChevronRight size={8} color="rgba(255,255,255,0.35)" />
          </TouchableOpacity>

          <View style={ls.icloudBanner}>
            <View style={ls.icloudTop}>
              <CloudIcon />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={ls.icloudTitle}>Сообщения в iCloud</Text>
                <Text style={ls.icloudBody}>
                  Освободите место в хранилище{"\n"}на своем устройстве,
                  переместив{"\n"}старые фото в iCloud.
                </Text>
              </View>
              <TouchableOpacity style={ls.icloudClose} activeOpacity={0.7}>
                <Text
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: 13,
                    fontWeight: "600",
                  }}
                >
                  ✕
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={ls.icloudBtn} activeOpacity={0.8}>
              <Text style={ls.icloudBtnText}>
                Включить «Сообщения в iCloud»
              </Text>
            </TouchableOpacity>
          </View>

          {CONVERSATIONS.map((convo, index) => (
            <TouchableOpacity
              key={convo.id}
              style={[ls.row, index < CONVERSATIONS.length - 1 && ls.rowBorder]}
              activeOpacity={0.6}
              onPress={() => onOpen(convo)}
            >
              <View style={ls.dotWrap}>
                {convo.unread && <View style={ls.unreadDot} />}
              </View>

              <Avatar size={46} />

              <View style={ls.rowContent}>
                <View style={ls.rowTop}>
                  <Text style={ls.rowName}>{convo.name}</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Text style={ls.rowTime}>{convo.time}</Text>
                    <ChevronRight size={7} color="rgba(255,255,255,0.3)" />
                  </View>
                </View>
                <Text style={ls.rowPreview1} numberOfLines={1}>
                  {convo.preview1}
                </Text>
                {convo.preview2 && (
                  <Text style={ls.rowPreview2} numberOfLines={1}>
                    {convo.preview2}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}

const ls = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000" },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  editBtn: {
    backgroundColor: "rgba(255,255,255,0.13)",
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  editText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: FONT,
  },
  menuBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.13)",
    alignItems: "center",
    justifyContent: "center",
  },
  largeTitle: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "700",
    fontFamily: FONT,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    letterSpacing: -0.5,
  },
  contactBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1c1c1e",
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  contactBannerName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: FONT,
  },
  contactBannerSub: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
    fontFamily: FONT,
    marginTop: 1,
  },
  icloudBanner: {
    backgroundColor: "#1c1c1e",
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
  },
  icloudTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  icloudTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: FONT,
    marginBottom: 4,
  },
  icloudBody: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
    fontFamily: FONT,
    lineHeight: 20,
  },
  icloudClose: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  icloudBtn: {
    backgroundColor: "#4A90D9",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  icloudBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: FONT,
  },
  dotWrap: { width: 20, alignItems: "center", justifyContent: "center" },
  unreadDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: "#0A84FF",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingRight: 16,
    marginLeft: 16,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  rowContent: { flex: 1, marginLeft: 12 },
  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  rowName: { color: "#fff", fontSize: 17, fontWeight: "600", fontFamily: FONT },
  rowTime: { color: "rgba(255,255,255,0.45)", fontSize: 15, fontFamily: FONT },
  rowPreview1: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 15,
    fontFamily: FONT,
    lineHeight: 20,
  },
  rowPreview2: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 15,
    fontFamily: FONT,
    lineHeight: 20,
  },
});

function SMSThreadScreen({ convo, onBack }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(18)).current;
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    if (!text.trim()) return;

    const userText = text;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: "sent",
        text: userText,
      },
    ]);

    setText("");

    if (convo.id === "4000") {
      const ticketNumber =
        "000091" +
        Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0");

      const now = new Date();

      const dateTime =
        now.toLocaleDateString("ro-RO") +
        " " +
        now.toLocaleTimeString("ro-RO", {
          hour: "2-digit",
          minute: "2-digit",
        });

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `reply-${Date.now()}`,
            type: "ticket",
            ticketNumber,
            dateTime,
          },
        ]);
      }, 800);
    }
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const is4000 = convo.id === "4000";

  return (
    <Animated.View style={[ts.root, { opacity: fadeAnim }]}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <SafeAreaView style={{ backgroundColor: "#000" }}>
        <View style={ts.navbar}>
          <TouchableOpacity
            style={ts.backBtn}
            activeOpacity={0.6}
            onPress={onBack}
          >
            <BackArrow />
            <View style={ts.badgePill}>
              <Text style={ts.badgeText}>58</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={ts.navCenter} activeOpacity={0.7}>
            <Avatar size={44} />
            <View style={ts.navNameRow}>
              <View style={ts.navNameGlass}>
                <Text style={ts.navName}>{convo.name}</Text>
                <ChevronRight size={7} color="rgba(255,255,255,0.7)" />
              </View>
            </View>
          </TouchableOpacity>

          <View style={ts.navRight} />
        </View>

        <View style={ts.smsLabelWrap}>
          <Text style={ts.smsLabel}>Текстовое сообщение · SMS</Text>
          <Text style={ts.smsTime}>Сегодня {convo.time}</Text>
        </View>
      </SafeAreaView>

      <Animated.ScrollView
        style={{ flex: 1, opacity: fadeAnim }}
        contentContainerStyle={ts.msgListContent}
      >
        {is4000 ? (
          <>
            <Animated.View
              style={[ts.sentRow, { transform: [{ translateY: slideAnim }] }]}
            >
              <View style={ts.sentBubble}>
                <Text style={ts.sentText}>936</Text>
              </View>
            </Animated.View>
            <Animated.View
              style={[
                ts.receivedRow,
                { transform: [{ translateY: slideAnim }] },
              ]}
            >
              <View style={ts.receivedBubble}>
                {[
                  "IM PUA",
                  "",
                  "Bilet Nr MCA-000091592",
                  "",
                  "12.06.2026 19:25",
                  "",
                  "Pret 7 MDL",
                  "",
                  "Bord 936",
                ].map((line, i) => (
                  <Text
                    key={i}
                    style={line === "" ? { height: 8 } : ts.receivedLine}
                  >
                    {line}
                  </Text>
                ))}
              </View>
            </Animated.View>
          </>
        ) : (
          <Animated.View
            style={[ts.receivedRow, { transform: [{ translateY: slideAnim }] }]}
          >
            <View style={ts.receivedBubble}>
              <Text style={ts.receivedLine}>{convo.preview1}</Text>
              {convo.preview2 && (
                <Text style={ts.receivedLine}>
                  {convo.preview2.replace("…", "")}
                </Text>
              )}
            </View>
          </Animated.View>
        )}
        {messages.map((msg) => {
          if (msg.type === "ticket") {
            return (
              <View key={msg.id} style={ts.receivedRow}>
                <View style={ts.receivedBubble}>
                  {[
                    "IM PUA",
                    "",
                    `Bilet Nr MCA-${msg.ticketNumber}`,
                    "",
                    msg.dateTime,
                    "",
                    "Pret 7 MDL",
                    "",
                    "Bord 936",
                  ].map((line, i) => (
                    <Text
                      key={i}
                      style={line === "" ? { height: 8 } : ts.receivedLine}
                    >
                      {line}
                    </Text>
                  ))}
                </View>
              </View>
            );
          }

          return (
            <View key={msg.id} style={ts.sentRow}>
              <View style={ts.sentBubble}>
                <Text style={ts.sentText}>{msg.text}</Text>
              </View>
            </View>
          );
        })}
      </Animated.ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SafeAreaView style={{ backgroundColor: "#000" }}>
          <View style={ts.inputBar}>
            <TouchableOpacity style={ts.plusBtn} activeOpacity={0.7}>
              <PlusIcon />
            </TouchableOpacity>
            <View style={ts.inputField}>
              <TextInput
                style={ts.inputText}
                placeholder="Текстовое сообщение •…"
                placeholderTextColor="rgba(255,255,255,0.32)"
                returnKeyType="send"
                onSubmitEditing={sendMessage}
                value={text}
                onChangeText={setText}
              />
              <TouchableOpacity
                style={{ padding: 4, marginLeft: 4 }}
                activeOpacity={0.7}
              >
                <MicIcon />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Animated.View>
  );
}

const ts = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000" },
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
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  badgeText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
    fontFamily: FONT,
  },
  navNameGlass: {
    backgroundColor: "rgba(255,255,255,0.08)",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,

    borderRadius: 12,

    borderTopWidth: 1,
    borderLeftWidth: 1,

    borderTopColor: "rgba(255,255,255,0.25)",
    borderLeftColor: "rgba(255,255,255,0.15)",
  },
  navCenter: { alignItems: "center", gap: 4, flex: 1 },
  navNameRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  navName: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    fontFamily: FONT,
    letterSpacing: -0.2,
  },
  navRight: { minWidth: 70 },
  smsLabelWrap: { alignItems: "center", paddingBottom: 10, gap: 1 },
  smsLabel: { color: "rgba(255,255,255,0.45)", fontSize: 12, fontFamily: FONT },
  smsTime: { color: "rgba(255,255,255,0.45)", fontSize: 12, fontFamily: FONT },
  msgListContent: {
    paddingHorizontal: 8,
    paddingTop: 4,
    paddingBottom: 16,
    gap: 8,
  },
  sentRow: { alignItems: "flex-end", marginRight: 4, marginBottom: 4 },
  sentBubble: {
    backgroundColor: "#248A3D",
    borderRadius: 20,
    borderBottomRightRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 9,
    maxWidth: width * 0.72,
  },
  sentText: { color: "#fff", fontSize: 17, fontFamily: FONT, lineHeight: 22 },
  receivedRow: { alignItems: "flex-start", marginLeft: 4 },
  receivedBubble: {
    backgroundColor: "#1c1c1e",
    borderRadius: 20,
    borderBottomLeftRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: width * 0.78,
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.07)",
  },
  receivedLine: {
    color: "#fff",
    fontSize: 17,
    fontFamily: FONT,
    lineHeight: 22,
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
    fontFamily: FONT,
    paddingVertical: 6,
  },
});
export default function App() {
  const [screen, setScreen] = useState("list");
  const [activeConvo, setActiveConvo] = useState(null);

  if (screen === "thread" && activeConvo) {
    return (
      <SMSThreadScreen
        convo={activeConvo}
        onBack={() => {
          setScreen("list");
          setActiveConvo(null);
        }}
      />
    );
  }

  return (
    <MessagesListScreen
      onOpen={(convo) => {
        setActiveConvo(convo);
        setScreen("thread");
      }}
    />
  );
}
