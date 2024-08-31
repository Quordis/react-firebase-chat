import { useEffect, useState } from "react";
import "./makeGroup.css"
import { toast } from "react-toastify";
import { db } from "../../../../lib/firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useUserStore } from "../../../../lib/userStore";

const MakeGroup = (props) => {
    const [avatar, setAvatar] = useState({
        file: null,
        url: ""
    })
    const [chats, setChats] = useState([]);
    const [users, setUsers] = useState([]);
    
    const {currentUser} = useUserStore();

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
            const items = res.data().chats;

            const promises = items.map(async (item) => {
                const userDocRef = doc(db, "users", item.receiverId);
                const userDocSnap = await getDoc(userDocRef);

                const user = userDocSnap.data();

                return {...item, user}
            })

            const chatData = await Promise.all(promises);

            setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
        });

        return () => {
            unSub();
        }
    }, [currentUser.id]);

    const handleAvatar = (e) => {
        if (!e.target.files[0].type.includes("image")) return toast.error("It's not an image!");
        setAvatar({
            file: e.target.files[0],
            url: URL.createObjectURL(e.target.files[0])
        })
    }

    const handleAdd = () => {
        let userSearch = document.getElementById('userSearch').value;
        let user = chats.filter(chat => chat.user.id === userSearch);
        let {username} = user[0].user;

        let cannotAdd = false;

        users.forEach(({user}) => {
            if (user.username.includes(username)) {
                cannotAdd = true;
                return;
            }
        })

        if (cannotAdd) return;
        
        setUsers([...users, user])
        setUsers(prev => prev.flat())
    }

    const handleRemove = (e) => {
        let username = e.target.previousSibling.innerHTML;
        users.forEach(({user}) => {
            if (user.username.includes(username)) {
                setUsers(prev => prev.filter(({user}) => user.username !== username));
            }
        })
        
    }

    const handleMake = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const {groupname, groupdesc} = Object.fromEntries(formData);

        let usersID = users.map(({user}) => {
            return user.id
        })

        console.log(usersID);
    }

    return (
        <div className="makeGroup">
            <form onSubmit={handleMake}>
                <div>
                    <img src={avatar.url || "./avatar.png"} alt="avatar" />
                    <label htmlFor="groupavatar">Select Group Avatar</label>
                    <input type="file" name="groupavatar" id="groupavatar" onChange={handleAvatar}/>
                </div>
                <div>
                    <label htmlFor="groupname">Group Name: </label>
                    <input type="text" name="groupname" id="groupname"/>
                </div>
                <div>
                    <label htmlFor="groupdesc">Group Description: </label>
                    <textarea name="groupdesc" id="groupdesc" ></textarea>
                </div>
                <div>
                    <div className="membersContainer">
                    <p>Members: </p>
                    <select name="userSearch" id="userSearch">
                        {chats?.map(chat => {
                           return <option value={chat.user.id}>{chat.user.username}</option>
                                })
                         }
                    </select>
                    <button onClick={handleAdd}>Add Member</button>
                    </div>
                    <div className="usersContainer">
                        {users.map(({user}) => {
                            return <div className="users">
                                    <img src={user.avatar} alt="avatar" />
                                    <p>{user.username}</p>
                                    <img src="/close.png" alt="close" className="removeMember" onClick={handleRemove}/>
                                </div>
                        })
                        }
                    </div>
                </div>
                <button>Make a Group</button>
            </form>
            <img src="/close.png" alt="close" className="close" onClick={props.changeMakeMode}/>
        </div>
    )
}

export default MakeGroup;