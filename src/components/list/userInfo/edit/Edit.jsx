import { useState } from "react";
import { useUserStore } from "../../../../lib/userStore";
import "./edit.css";
import { ref } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { toast } from "react-toastify";
import upload from "../../../../lib/upload";

const Edit = () => {
    const {currentUser} = useUserStore();
    const [avatar, setAvatar] = useState(currentUser.avatar);
    const [username, setUsername] = useState(currentUser.username);
    const [desc, setDesc] = useState(currentUser.desc);

    const handleAvatarChange = (e) => {
        if (e.target.files[0]) {
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            })
        }
    }

    const handleNameChange = (e) => {
        setUsername(e.target.value)
    }

    const handleDescChange = (e) => {
        setDesc(e.target.value)
    }

    const handleSubmit = async(e) => {
        e.preventDefault();

        let imgUrl = typeof avatar === "object" ? await upload(avatar.file, "images") : avatar;

        const formData = new FormData(e.target);
        const {username, desc} = Object.fromEntries(formData);
        try {
            await updateDoc(doc(db, "users", currentUser.id), {
                username,
                desc,
                avatar: imgUrl
            })

            toast.success("Saved!");
        } catch (err) {
            console.log(err);
            toast.error("Something went Wrong!");
        }
    }

    return (
        <div className="edit">
            <form onSubmit={handleSubmit}>
                <label htmlFor="fileChange">
                    <img src={typeof avatar === "object" ? avatar.url : avatar} alt="avatar"/>
                </label>
                <input type="file" id="fileChange" style={{display: "none"}} onChange={handleAvatarChange}/>
                <input type="text" placeholder="Username" value={username} name="username" onChange={handleNameChange} minLength="5"/>
                <input type="text" placeholder="Description" value={desc} name="desc" onChange={handleDescChange}/>
                <button>Save</button>
            </form>
        </div>
    )
}

export default Edit;