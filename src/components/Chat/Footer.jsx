import {
    Box, Fab, IconButton, InputAdornment, Stack, TextField, Tooltip,
} from "@mui/material";
import {
    Camera, File, Image, LinkSimple, PaperPlaneTilt, Smiley, Sticker, User,
} from "phosphor-react";
import {useTheme, styled} from "@mui/material/styles";
import React, {useRef, useState} from "react";
import useResponsive from "../../hooks/useResponsive";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import conversationStore from "../../store/conversationStore.js";
import userStore from "../../store/userStore.js";
import messageService from "../../services/messageService.js";

const StyledInput = styled(TextField)(({theme}) => ({
    "& .MuiInputBase-input": {
        paddingTop: "12px !important", paddingBottom: "12px !important",
    },
}));

const Actions = [{
    color: "#4da5fe", icon: <Image size={24}/>, y: 102, title: "Photo/Video",
}, {
    color: "#1b8cfe", icon: <Sticker size={24}/>, y: 172, title: "Stickers",
}, {
    color: "#0172e4", icon: <Camera size={24}/>, y: 242, title: "Image",
}, {
    color: "#0159b2", icon: <File size={24}/>, y: 312, title: "Document",
}, {
    color: "#013f7f", icon: <User size={24}/>, y: 382, title: "Contact",
},];

const ChatInput = ({
                       openPicker, setOpenPicker, setValue, value, inputRef, fileInputRef
                   }) => {

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
            };
            reader.readAsDataURL(file);
        } else {
            return;
        }
    };

    return (<StyledInput
        inputRef={inputRef}
        value={value}
        onChange={(event) => {
            setValue(event.target.value);
        }}
        fullWidth
        placeholder="Write a message..."
        variant="filled"
        InputProps={{
            disableUnderline: true, startAdornment: (<Stack sx={{width: "max-content"}}>
                <InputAdornment>
                    <IconButton
                        onClick={handleButtonClick}
                    >
                        <LinkSimple/>
                    </IconButton>
                </InputAdornment>

                <input
                    type="file"
                    ref={fileInputRef}
                    style={{display: 'none'}}
                    onChange={handleFileChange}
                    accept="image/*"
                    multiple={true}
                />
            </Stack>), endAdornment: (<Stack sx={{position: "relative"}}>
                <InputAdornment>
                    <IconButton
                        onClick={() => {
                            setOpenPicker(!openPicker);
                        }}
                    >
                        <Smiley/>
                    </IconButton>
                </InputAdornment>
            </Stack>),
        }}
    />);
};

function linkify(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url) => `<a href="${url}" target="_blank">${url}</a>`);
}

function containsUrl(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return urlRegex.test(text);
}

const Footer = ({refresh}) => {
    const theme = useTheme();

    const sideBar = {
        open: true,
    };

    const isMobile = useResponsive("between", "md", "xs", "sm");

    const [openPicker, setOpenPicker] = React.useState(false);

    const [value, setValue] = useState("");
    const inputRef = useRef(null);
    const fileInputRef = useRef(null);
    const {conversation} = conversationStore();
    const {user} = userStore();

    function handleEmojiClick(emoji) {
        const input = inputRef.current;

        if (input) {
            const selectionStart = input.selectionStart;
            const selectionEnd = input.selectionEnd;

            setValue(value.substring(0, selectionStart) + emoji + value.substring(selectionEnd));

            // Move the cursor to the end of the inserted emoji
            input.selectionStart = input.selectionEnd = selectionStart + 1;
        }
    }

    const handleSendMessage = () => {
        if (conversation && user) {
            const formData = new FormData();
            formData.append('conversationId', conversation._id);
            formData.append('senderId', user._id);
            formData.append('text', linkify(value));

            Array.from(fileInputRef.current.files).forEach(file => formData.append('files', file))
            messageService.sendMessage(formData).then(() => {
                refresh()
            }).catch(() => {

            }).finally(() => setValue(""), fileInputRef.current.files = []);
        }
    }

    return (<Box
        sx={{
            position: "relative", backgroundColor: "transparent !important",
        }}
    >
        <Box
            p={isMobile ? 1 : 2}
            width={"100%"}
            sx={{
                backgroundColor: theme.palette.mode === "light" ? "#F8FAFF" : theme.palette.background,
                boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
            }}
        >
            <Stack direction="row" alignItems={"center"} spacing={isMobile ? 1 : 3}>
                <Stack sx={{width: "100%"}}>
                    <Box
                        style={{
                            zIndex: 10,
                            position: "fixed",
                            display: openPicker ? "inline" : "none",
                            bottom: 81,
                            right: isMobile ? 20 : sideBar.open ? 420 : 100,
                        }}
                    >
                        <Picker
                            theme={theme.palette.mode}
                            data={data}
                            onEmojiSelect={(emoji) => {
                                console.log(emoji)
                                handleEmojiClick(emoji.native);
                            }}
                        />
                    </Box>
                    {/* Chat Input */}
                    <ChatInput
                        inputRef={inputRef}
                        value={value}
                        setValue={setValue}
                        openPicker={openPicker}
                        setOpenPicker={setOpenPicker}
                        fileInputRef={fileInputRef}
                    />
                </Stack>
                <Box
                    sx={{
                        height: 48, width: 48, backgroundColor: theme.palette.primary.main, borderRadius: 1.5,
                    }}
                >
                    <Stack
                        sx={{height: "100%"}}
                        alignItems={"center"}
                        justifyContent="center"
                    >
                        <IconButton
                            onClick={handleSendMessage}
                        >
                            <PaperPlaneTilt color="#ffffff"/>
                        </IconButton>
                    </Stack>
                </Box>
            </Stack>
        </Box>
    </Box>);
};

export default Footer;
