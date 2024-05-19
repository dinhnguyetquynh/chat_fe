import React, { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button,
} from "@mui/material";
import { MagnifyingGlass, Check, X } from "phosphor-react";
import { useTheme } from "@mui/material/styles";
import { SimpleBarStyle } from "../../components/Scrollbar";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/Search";
import { faker } from "@faker-js/faker";

const generateFakeRequests = () => {
  return Array.from({ length: 20 }, () => ({
    id: faker.datatype.uuid(),
    name: faker.name.findName(),
    avatar: faker.image.avatar(),
  }));
};

const FriendRequest = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    setFriendRequests(generateFakeRequests());
  }, []);

  const handleAccept = (id) => {
    setFriendRequests(friendRequests.filter((request) => request.id !== id));
  };

  const handleReject = (id) => {
    setFriendRequests(friendRequests.filter((request) => request.id !== id));
  };

  const theme = useTheme();
  return (
    <>
      <Stack direction="row" sx={{ width: "100%" }}>
        <Box
          sx={{
            overflowY: "scroll",
            height: "100vh",
            width: 320,
            backgroundColor:
              theme.palette.mode === "light"
                ? "#F8FAFF"
                : theme.palette.background,
            boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
          }}
        >
          <Stack p={3} spacing={2} sx={{ maxHeight: "100vh" }}>
            <Typography variant="h5">Friend Requests</Typography>
            <Search>
              <SearchIconWrapper>
                <MagnifyingGlass color="#709CE6" />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
            <Divider />
            <SimpleBarStyle timeout={500} clickOnTrack={false}>
              <List>
                {friendRequests.map((request) => (
                  <ListItem key={request.id}>
                    <ListItemAvatar>
                      <Avatar src={request.avatar} />
                    </ListItemAvatar>
                    <ListItemText primary={request.name} />
                    <IconButton onClick={() => handleAccept(request.id)}>
                      <Check size={24} />
                    </IconButton>
                    <IconButton onClick={() => handleReject(request.id)}>
                      <X size={24} />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </SimpleBarStyle>
          </Stack>
        </Box>
      </Stack>
    </>
  );
};

export default FriendRequest;
