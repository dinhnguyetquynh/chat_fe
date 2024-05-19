import {CircularProgress, Stack} from '@mui/material';
import {Outlet, useNavigate} from 'react-router-dom';
import useResponsive from '../../hooks/useResponsive';
import SideNav from './SideNav';

import localStorageService from '../../services/localStorageService';
import {APP_KEY} from '../../common/constant';
import userService from '../../services/userService'
import {useEffect} from "react";
import userStore from '../../store/userStore';

const DashboardLayout = () => {
        const isDesktop = useResponsive('up', 'md');
        const navigation = useNavigate();
        const {user, setUser} = userStore()
        useEffect(() => {
            if (!localStorageService.getValue(APP_KEY.token)) {
                return navigation('/auth/login')
            }
            userService.getUserInfo().then(resp => {
                setUser(resp)
            }).catch(() => {
                navigation('/auth/login')
            })
        }, []);


        return (
            <>
                {user ? <Stack direction="row">
                    {isDesktop && (
                        // SideBar
                        <SideNav/>
                    )}

                    <Outlet/>
                </Stack> : <div style={{
                    width: "100dvw",
                    height: "100dvh",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}><CircularProgress/></div>}
                {/* {open_audio_notification_dialog && (
        <AudioCallNotification open={open_audio_notification_dialog} />
      )}
      {open_audio_dialog && (
        <AudioCallDialog
          open={open_audio_dialog}
          handleClose={handleCloseAudioDialog}
        />
      )}
      {open_video_notification_dialog && (
        <VideoCallNotification open={open_video_notification_dialog} />
      )}
      {open_video_dialog && (
        <VideoCallDialog
          open={open_video_dialog}
          handleClose={handleCloseVideoDialog}
        />
      )} */}
            </>
        );
    }
;

export default DashboardLayout;
