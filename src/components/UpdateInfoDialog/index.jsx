import {Box, Button, Dialog, DialogContent, DialogTitle, TextField, Typography} from "@mui/material";
import {useState} from "react";
import userService from "../../services/userService.js";

const UpdateInfoDialog = () => {
    const [formData, setFormData] = useState({
        displayName: '',
        avatar: null,
        imagePreview: null
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                avatar: file,
                imagePreview: URL.createObjectURL(file),
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        const _formData = new FormData();
        _formData.append('displayName', formData.displayName);
        _formData.append('avatar', formData.avatar);
        userService.updateUserNameAndAvatar(_formData).then(() => {
            window.location.reload()
        }).catch(() => {
        })
    };


    return <Dialog open={true}>
        <DialogTitle id="alert-dialog-title">
            {"Cập nhật thông tin người dùng"}
        </DialogTitle>
        <DialogContent sx={{marginTop: 5}}>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    width: 400,
                    margin: '0 auto',
                    padding: 2,
                    border: '1px solid #ccc',
                    borderRadius: 2,
                }}
            >
                <TextField
                    label="Tên người dùng"
                    variant="outlined"
                    name="displayName"
                    value={formData.text}
                    onChange={handleInputChange}
                    fullWidth
                    required={true}
                />
                <Button
                    variant="contained"
                    component="label"
                >
                    Chọn ảnh
                    <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </Button>
                {formData.imagePreview && (
                    <Box mt={2}>
                        <Typography variant="subtitle1">Ảnh đã chọn:</Typography>
                        <img
                            src={formData.imagePreview}
                            alt="Selected"
                            style={{width: 'auto', height: 200, marginTop: '10px'}}
                        />
                    </Box>
                )}
                <Button type="submit" variant="contained" color="primary"
                        disabled={!(formData.displayName && formData.avatar)}>
                    Cập nhật
                </Button>
            </Box>
        </DialogContent>
    </Dialog>
}
export default UpdateInfoDialog