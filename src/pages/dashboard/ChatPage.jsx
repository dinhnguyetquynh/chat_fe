import {Stack, Box, CircularProgress} from "@mui/material";
import {useEffect, useRef} from "react";
import {useTheme} from "@mui/material/styles";
import {SimpleBarStyle} from "../../components/Scrollbar";

import {ChatHeader, ChatFooter} from "../../components/Chat";
import useResponsive from "../../hooks/useResponsive";
import {
    DocMsg, LinkMsg, MediaMsg, ReplyMsg, TextMsg, Timeline,
} from "../../sections/Dashboard/Conversation";
import {useParams} from "react-router-dom";
import useSWR from "swr";
import conversationService from "../../services/conversationService.js";
import messageService from "../../services/messageService.js";
import userStore from "../../store/userStore.js";
import conversationStore from "../../store/conversationStore.js";

const Conversation = ({isMobile, menu, conversationId, messages, isLoading}) => {
    const {user} = userStore()

    return (isLoading ? <CircularProgress/> : <Box p={isMobile ? 1 : 3}>
        <Stack spacing={3}>
            {messages.map((message) => {
                return {
                    type: 'msg',
                    message: message.text,
                    subtype: Array.isArray(message.files) ? "img" : "",
                    imgs: message.files,
                    incoming: user._id !== message.senderId._id,
                    outgoing: user._id === message.senderId._id,
                }
            }).reverse().map((el, idx) => {
                switch (el.type) {
                    case "divider":
                        return (// Timeline
                            <Timeline el={el}/>);

                    case "msg":
                        switch (el.subtype) {
                            case "img":
                                return (// Media Message
                                    <MediaMsg el={el} menu={menu}/>);

                            case "doc":
                                return (// Doc Message
                                    <DocMsg el={el} menu={menu}/>);
                            case "Link":
                                return (//  Link Message
                                    <LinkMsg el={el} menu={menu}/>);

                            case "reply":
                                return (//  ReplyMessage
                                    <ReplyMsg el={el} menu={menu}/>);

                            default:
                                return (// Text Message
                                    <TextMsg el={el} menu={menu}/>);
                        }

                    default:
                        return <></>;
                }
            })}
        </Stack>
    </Box>);
};

const ChatPage = () => {
    const isMobile = useResponsive("between", "md", "xs", "sm");
    const theme = useTheme();

    const messageListRef = useRef(null);
    const {id} = useParams();
    const {
        data, isLoading
    } = useSWR(`/conversations/${id}`, () => conversationService.getConversationById(id), {refreshInterval: 2000});


    const {
        data: messageData, isLoading: messageLoading, mutate: refresh
    } = useSWR(`/messages/${id}`, () => messageService.getMessageListByConversationId(id), {refreshInterval: 1000})
    const {setConversation, UnSetConversation} = conversationStore();

    useEffect(() => {
        if (messageListRef) {
            setTimeout(() => {
                messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
            }, 1000)
        }
    }, [id]);

    useEffect(() => {
        if (data) {
            setConversation(data)
        }
        () => UnSetConversation()
    }, [id]);


    return (isLoading ? <CircularProgress/> : <>
            <Stack
                height={"100%"}
                maxHeight={"100vh"}
                width={isMobile ? "100vw" : "auto"}
            >
                {/*  */}
                <ChatHeader/>
                <Box
                    ref={messageListRef}
                    width={"100%"}
                    sx={{
                        position: "relative", flexGrow: 1, overflow: "scroll",

                        backgroundColor: theme.palette.mode === "light" ? "#F0F4FA" : theme.palette.background,

                        boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
                    }}
                >
                    <SimpleBarStyle timeout={500} clickOnTrack={false}>
                        <Conversation menu={true} isMobile={isMobile} conversationId={id}
                                      messages={messageData ? messageData.messages : []} isLoading={messageLoading}/>
                    </SimpleBarStyle>
                </Box>

                {/*  */}
                <ChatFooter refresh={refresh}/>
            </Stack>
            {/* {(() => {
        switch (sideBar.type) {
          case "CONTACT":
            return <Contact />;

          case "STARRED":
            return <StarredMessages />;

          case "SHARED":
            return <Media />;

          default:
            break;
        }
      })()} */}
        </>

    );
};

export default ChatPage;

export {Conversation};
