import { useTheme } from "@mui/material/styles";
import { Box, Stack } from "@mui/material";

import Chats from "./Conversations";
import NoChat from "../../assets/Illustration/NoChat";
import { Outlet, useParams } from "react-router-dom/dist";

const ConversationPage = () => {
  let { id } = useParams();
  const theme = useTheme();

  return (
    <>
      <Stack direction="row" sx={{ width: "100%" }}>
        <Chats />
        {
          <Box
            sx={{
              height: "100%",
              width: "100%",
              backgroundColor:
                theme.palette.mode === "light"
                  ? "#FFF"
                  : theme.palette.background.paper,
              display: !id ? "flex" : "",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {id ? (
              <Outlet />
            ) : (
              <div>
                <NoChat />
                <p>Vui lòng chọn cuộc trò chuyện để có thể nhắn tin!</p>
              </div>
            )}
          </Box>
        }
      </Stack>
    </>
  );
};

export default ConversationPage;
