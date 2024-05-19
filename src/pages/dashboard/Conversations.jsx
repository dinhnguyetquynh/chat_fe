import {useState} from 'react';
import {
    Box, CircularProgress, IconButton, Stack, Typography,
} from '@mui/material';
import {
    CircleDashed, MagnifyingGlass, Users,
} from 'phosphor-react';
import {SimpleBarStyle} from '../../components/Scrollbar';
import {useTheme} from '@mui/material/styles';
import useResponsive from '../../hooks/useResponsive';
import BottomNav from '../../layouts/dashboard/BottomNav';
import ChatElement from '../../components/ChatElement';
import {
    Search, SearchIconWrapper, StyledInputBase,
} from '../../components/Search';
import Friends from '../../sections/Dashboard/Friends';
import useSWR from "swr";
import conversationService from "../../services/conversationService.js";
import userStore from "../../store/userStore.js";
import moment from "moment";

const sliceName = (name) => name.length > 10 ? name.slice(0, 10) + '...' : name;
const Conversations = () => {
    const theme = useTheme();
    const isDesktop = useResponsive('up', 'md');
    const {user} = userStore()
    const {
        data,
        isLoading
    } = useSWR('/conversations', () => conversationService.getConversationList(), {refreshInterval: 1000})


    const [openDialog, setOpenDialog] = useState(false);

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    return (<>
        <Box
            sx={{
                position: 'relative',
                height: '100%',
                width: isDesktop ? 440 : '100vw',
                backgroundColor: theme.palette.mode === 'light' ? '#F8FAFF' : theme.palette.background,

                boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.25)',
            }}
        >
            {!isDesktop && (// Bottom Nav
                <BottomNav/>)}

            <Stack p={3} spacing={2} sx={{maxHeight: '100vh'}}>
                <Stack
                    alignItems={'center'}
                    justifyContent="space-between"
                    direction="row"
                >
                    <Typography variant="h5">Conversations</Typography>

                    <Stack direction={'row'} alignItems="center" spacing={1}>
                        <IconButton
                            onClick={() => {
                                handleOpenDialog();
                            }}
                            sx={{width: 'max-content'}}
                        >
                            <Users/>
                        </IconButton>
                        <IconButton sx={{width: 'max-content'}}>
                            <CircleDashed/>
                        </IconButton>
                    </Stack>
                </Stack>
                <Stack sx={{width: '100%'}}>
                    <Search>
                        <SearchIconWrapper>
                            <MagnifyingGlass color="#709CE6"/>
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{'aria-label': 'search'}}
                        />
                    </Search>
                </Stack>
                {/*<Stack spacing={1}>*/}
                {/*    <Stack direction={'row'} spacing={1.5} alignItems="center">*/}
                {/*        <ArchiveBox size={24}/>*/}
                {/*        <Button variant="text">Archive</Button>*/}
                {/*    </Stack>*/}
                {/*    <Divider/>*/}
                {/*</Stack>*/}
                <Stack
                    sx={{
                        flexGrow: 1, overflowY: 'scroll', height: '100%',
                    }}
                >
                    <SimpleBarStyle timeout={500} clickOnTrack={false}>
                        <Stack spacing={2.4} sx={{overflow: 'hidden', height: 'auto'}}>
                            <Typography variant="subtitle2" sx={{color: '#676667'}}>
                                All Conversations
                            </Typography>
                            {/* Chat List */}
                            {isLoading ? <CircularProgress/> : data?.map(el => {
                                const friend = el.members.find(_user => user._id != _user._id);

                                const data = {
                                    img: el.members.length > 2 ? el.avatar : friend.avatar,
                                    name: el.members.length > 2 ? sliceName(el.name) : sliceName(friend.displayName),
                                    msg: el.message ? (Array.isArray(el.message.files) && el.message.files.length > 0 ? "Ảnh ..." : (el.message?.text ? el.message?.text : "")) : "Chưa có tin nhắn",
                                    time: moment(el.updatedAt).fromNow(),
                                    unread: 0,
                                    online: true,
                                    id: el._id
                                }
                                return data;
                            }).map((el, idx) => {
                                return <ChatElement {...el} key={idx}/>;
                            })}
                        </Stack>
                    </SimpleBarStyle>
                </Stack>
            </Stack>
        </Box>
        {openDialog && (<Friends open={openDialog} handleClose={handleCloseDialog}/>)}
    </>);
};

export default Conversations;
