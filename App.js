import React, { useState, useRef, useEffect, useCallback } from "react";
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
  Modal,
  Alert,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
const FONT = Platform.select({ ios: "SF Pro Text", default: "System" });

const STORAGE_MESSAGES_KEY = "sms_messages_v1";
const STORAGE_NAME_KEY = "contact_banner_name";

function formatTimestamp(ts) {
  const now = new Date();
  const d = new Date(ts);
  const diffMs = now - d;
  const diffDays = Math.floor(diffMs / 86400000);
  const timeStr = d.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
  if (diffDays === 0) return `Сегодня ${timeStr}`;
  if (diffDays === 1) return `Вчера ${timeStr}`;
  const days = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  const months = [
    "янв",
    "фев",
    "мар",
    "апр",
    "мая",
    "июн",
    "июл",
    "авг",
    "сен",
    "окт",
    "ноя",
    "дек",
  ];
  if (diffDays < 7)
    return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}, ${timeStr}`;
  return `${d.getDate()} ${months[d.getMonth()]} ${timeStr}`;
}

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
    id: "moldcell2",
    name: "Moldcell",
    preview1:
      "Ai reîncărcat contul cu 10.00 lei. Soldul actual: 10.51 lei. Instalează aplicația my…",
    preview2: null,
    time: "19:25",
    unread: true,
  },
];

function EditMenuModal({ visible, onClose, onRename, onReset, onEmergency }) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={em.overlay} activeOpacity={1} onPress={onClose}>
        <View style={em.sheet}>
          <Text style={em.sheetTitle}>Параметры</Text>

          <TouchableOpacity
            style={em.item}
            activeOpacity={0.7}
            onPress={onRename}
          >
            <View
              style={[em.itemIcon, { backgroundColor: "rgba(48,209,88,0.18)" }]}
            >
              <Text style={em.itemEmoji}>✏️</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={em.itemText}>Изменить имя</Text>
              <Text style={em.itemSub}>Изменить имя контакта в баннере</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={em.item}
            activeOpacity={0.7}
            onPress={onReset}
          >
            <View
              style={[
                em.itemIcon,
                { backgroundColor: "rgba(255,159,10,0.18)" },
              ]}
            >
              <Text style={em.itemEmoji}>🔄</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={em.itemText}>Сбросить сообщения</Text>
              <Text style={em.itemSub}>Восстановить исходное состояние</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={em.item}
            activeOpacity={0.7}
            onPress={onEmergency}
          >
            <View
              style={[em.itemIcon, { backgroundColor: "rgba(255,59,48,0.18)" }]}
            >
              <Text style={em.itemEmoji}>🆘</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[em.itemText, { color: "#FF3B30" }]}>
                Экстренное сообщение
              </Text>
              <Text style={em.itemSub}>Открыть SMS «936» на номер 4000</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={em.cancel}
            activeOpacity={0.7}
            onPress={onClose}
          >
            <Text style={em.cancelText}>Отмена</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const em = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#1c1c1e",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  sheetTitle: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 13,
    textAlign: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    fontFamily: FONT,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    paddingHorizontal: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  itemIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  itemEmoji: { fontSize: 16 },
  itemText: { color: "#fff", fontSize: 17, fontFamily: FONT },
  itemSub: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 13,
    fontFamily: FONT,
    marginTop: 2,
  },
  cancel: {
    margin: 16,
    backgroundColor: "#2c2c2e",
    borderRadius: 14,
    padding: 17,
    alignItems: "center",
  },
  cancelText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    fontFamily: FONT,
  },
});

function RenameModal({ visible, currentName, onClose, onConfirm }) {
  const [value, setValue] = useState(currentName);
  useEffect(() => {
    if (visible) setValue(currentName);
  }, [visible, currentName]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={rm.overlay}>
        <View style={rm.card}>
          <Text style={rm.title}>Изменить имя</Text>
          <Text style={rm.sub}>Введите новое имя для баннера контакта</Text>
          <TextInput
            style={rm.input}
            value={value}
            onChangeText={setValue}
            placeholder="Введите имя…"
            placeholderTextColor="rgba(255,255,255,0.3)"
            autoFocus
            returnKeyType="done"
            onSubmitEditing={() => value.trim() && onConfirm(value.trim())}
          />
          <View style={rm.actions}>
            <TouchableOpacity
              style={[rm.btn, rm.btnCancel]}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={rm.btnCancelText}>Отмена</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[rm.btn, rm.btnConfirm]}
              onPress={() => value.trim() && onConfirm(value.trim())}
              activeOpacity={0.7}
            >
              <Text style={rm.btnConfirmText}>Сохранить</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const rm = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#2c2c2e",
    borderRadius: 16,
    padding: 24,
    width: width - 64,
  },
  title: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
    fontFamily: FONT,
  },
  sub: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: FONT,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.2)",
    color: "#fff",
    fontSize: 17,
    padding: 12,
    fontFamily: FONT,
  },
  actions: { flexDirection: "row", gap: 12, marginTop: 16 },
  btn: { flex: 1, padding: 13, borderRadius: 10, alignItems: "center" },
  btnCancel: { backgroundColor: "rgba(255,255,255,0.1)" },
  btnConfirm: { backgroundColor: "#0A84FF" },
  btnCancelText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    fontFamily: FONT,
  },
  btnConfirmText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    fontFamily: FONT,
  },
});

function MessagesListScreen({ onOpen, contactName, onEditMenu }) {
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
          <TouchableOpacity
            style={ls.editBtn}
            activeOpacity={0.7}
            onPress={onEditMenu}
          >
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
              <Text style={ls.contactBannerName}>{contactName}</Text>
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
                  {
                    "Освободите место в хранилище\nна своем устройстве, переместив\nстарые фото в iCloud."
                  }
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
              key={convo.id + index}
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

function SMSThreadScreen({ convo, onBack, storedMessages, onAddMessage }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(18)).current;
  const scrollRef = useRef(null);
  const [text, setText] = useState("");

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

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [storedMessages]);

  const sendMessage = useCallback(() => {
    const userText = text.trim();
    if (!userText) return;
    setText("");

    const now = Date.now();
    onAddMessage(convo.id, {
      id: now.toString(),
      type: "sent",
      text: userText,
      timestamp: now,
    });

    if (convo.id === "4000" && userText === "936") {
      const ticketNumber =
        "000091" +
        Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0");
      const d = new Date();
      const dateTime =
        d.toLocaleDateString("ro-RO") +
        " " +
        d.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" });
      setTimeout(() => {
        onAddMessage(convo.id, {
          id: `reply-${Date.now()}`,
          type: "ticket",
          ticketNumber,
          dateTime,
          timestamp: Date.now(),
        });
      }, 1200);
    }
  }, [text, convo.id, onAddMessage]);

  const is4000 = convo.id === "4000";

  const renderMessages = () => {
    const items = [];
    let lastLabel = null;

    const addSeparator = (ts) => {
      const label = formatTimestamp(ts);
      if (label !== lastLabel) {
        lastLabel = label;
        items.push(
          <Text key={`sep-${ts}`} style={ts_s.timeSep}>
            {label}
          </Text>,
        );
      }
    };
    const originalTs = Date.now() - 60000;
    addSeparator(originalTs);
    if (is4000) {
      items.push(
        <Animated.View
          key="default-sent"
          style={[ts_s.sentRow, { transform: [{ translateY: slideAnim }] }]}
        >
          <View style={ts_s.sentBubble}>
            <Text style={ts_s.sentText}>936</Text>
          </View>
        </Animated.View>,
      );
      items.push(
        <Animated.View
          key="default-recv"
          style={[ts_s.receivedRow, { transform: [{ translateY: slideAnim }] }]}
        >
          <View style={ts_s.receivedBubble}>
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
                style={line === "" ? { height: 8 } : ts_s.receivedLine}
              >
                {line}
              </Text>
            ))}
          </View>
        </Animated.View>,
      );
    } else {
      items.push(
        <Animated.View
          key="default-recv"
          style={[ts_s.receivedRow, { transform: [{ translateY: slideAnim }] }]}
        >
          <View style={ts_s.receivedBubble}>
            <Text style={ts_s.receivedLine}>{convo.preview1}</Text>
            {convo.preview2 && (
              <Text style={ts_s.receivedLine}>
                {convo.preview2.replace("…", "")}
              </Text>
            )}
          </View>
        </Animated.View>,
      );
    }

    storedMessages.forEach((msg) => {
      addSeparator(msg.timestamp);
      if (msg.type === "sent") {
        items.push(
          <View key={msg.id} style={ts_s.sentRow}>
            <View style={ts_s.sentBubble}>
              <Text style={ts_s.sentText}>{msg.text}</Text>
            </View>
          </View>,
        );
      } else if (msg.type === "ticket") {
        items.push(
          <View key={msg.id} style={ts_s.receivedRow}>
            <View style={ts_s.receivedBubble}>
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
                  style={line === "" ? { height: 8 } : ts_s.receivedLine}
                >
                  {line}
                </Text>
              ))}
            </View>
          </View>,
        );
      }
    });

    return items;
  };

  return (
    <Animated.View style={[ts_s.root, { opacity: fadeAnim }]}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <SafeAreaView style={{ backgroundColor: "#000" }}>
        <View style={ts_s.navbar}>
          <TouchableOpacity
            style={ts_s.backBtn}
            activeOpacity={0.6}
            onPress={onBack}
          >
            <View style={ts_s.navNameGlass}>
              <BackArrow />
              <View style={ts_s.badgePill}>
                <Text style={ts_s.badgeText}>58</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={ts_s.navCenter} activeOpacity={0.7}>
            <Avatar size={44} />
            <View style={ts_s.navNameRow}>
              <View style={ts_s.navNameGlass}>
                <Text style={ts_s.navName}>{convo.name}</Text>
                <ChevronRight size={7} color="rgba(255,255,255,0.7)" />
              </View>
            </View>
          </TouchableOpacity>
          <View style={ts_s.navRight} />
        </View>
        <View style={ts_s.smsLabelWrap}>
          <Text style={ts_s.smsLabel}>Текстовое сообщение · SMS</Text>
          <Text style={ts_s.smsTime}>Сегодня {convo.time}</Text>
        </View>
      </SafeAreaView>

      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={ts_s.msgListContent}
      >
        {renderMessages()}
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SafeAreaView style={{ backgroundColor: "#000" }}>
          <View style={ts_s.inputBar}>
            <TouchableOpacity style={ts_s.plusBtn} activeOpacity={0.7}>
              <PlusIcon />
            </TouchableOpacity>
            <View style={ts_s.inputField}>
              <TextInput
                style={ts_s.inputText}
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

const ts_s = StyleSheet.create({
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
    gap: 4,
  },
  timeSep: {
    textAlign: "center",
    color: "rgba(255,255,255,0.4)",
    fontSize: 12,
    fontFamily: FONT,
    paddingVertical: 8,
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
  const [contactName, setContactName] = useState("Dumitru Ciobanu");
  const [messageStore, setMessageStore] = useState({}); // { [convoId]: Message[] }

  const [editMenuVisible, setEditMenuVisible] = useState(false);
  const [renameVisible, setRenameVisible] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [storedMsgs, storedName] = await Promise.all([
          AsyncStorage.getItem(STORAGE_MESSAGES_KEY),
          AsyncStorage.getItem(STORAGE_NAME_KEY),
        ]);
        if (storedMsgs) setMessageStore(JSON.parse(storedMsgs));
        if (storedName) setContactName(storedName);
      } catch (e) {
        console.warn("Storage load error:", e);
      }
    })();
  }, []);

  const persistMessages = useCallback(async (store) => {
    try {
      await AsyncStorage.setItem(STORAGE_MESSAGES_KEY, JSON.stringify(store));
    } catch (e) {
      console.warn("Storage save error:", e);
    }
  }, []);

  const addMessage = useCallback(
    (convoId, msg) => {
      setMessageStore((prev) => {
        const updated = { ...prev, [convoId]: [...(prev[convoId] || []), msg] };
        persistMessages(updated);
        return updated;
      });
    },
    [persistMessages],
  );

  const handleRename = useCallback((newName) => {
    setContactName(newName);
    AsyncStorage.setItem(STORAGE_NAME_KEY, newName).catch(() => {});
    setRenameVisible(false);
  }, []);

  const handleReset = useCallback(() => {
    Alert.alert(
      "Сбросить сообщения",
      "Восстановить исходное состояние всех переписок?",
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Сбросить",
          style: "destructive",
          onPress: () => {
            setMessageStore({});
            AsyncStorage.removeItem(STORAGE_MESSAGES_KEY).catch(() => {});
            setEditMenuVisible(false);
          },
        },
      ],
    );
  }, []);

  const handleEmergency = useCallback(() => {
    setEditMenuVisible(false);

    Linking.openURL("sms:4000?body=936").catch(() => {
      Alert.alert("Ошибка", "Не удалось открыть приложение SMS.");
    });
  }, []);

  if (screen === "thread" && activeConvo) {
    return (
      <>
        <SMSThreadScreen
          convo={activeConvo}
          storedMessages={messageStore[activeConvo.id] || []}
          onAddMessage={addMessage}
          onBack={() => {
            setScreen("list");
            setActiveConvo(null);
          }}
        />
      </>
    );
  }

  return (
    <>
      <MessagesListScreen
        contactName={contactName}
        onEditMenu={() => setEditMenuVisible(true)}
        onOpen={(convo) => {
          setActiveConvo(convo);
          setScreen("thread");
        }}
      />

      <EditMenuModal
        visible={editMenuVisible}
        onClose={() => setEditMenuVisible(false)}
        onRename={() => {
          setEditMenuVisible(false);
          setRenameVisible(true);
        }}
        onReset={handleReset}
        onEmergency={handleEmergency}
      />

      <RenameModal
        visible={renameVisible}
        currentName={contactName}
        onClose={() => setRenameVisible(false)}
        onConfirm={handleRename}
      />
    </>
  );
}
