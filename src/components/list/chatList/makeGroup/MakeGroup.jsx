import "./makeGroup.css"

const MakeGroup = (props) => {
    return (
        <div className="makeGroup">
            <form>
                <div>
                    <img src="./avatar.png" alt="avatar" />
                    <label htmlFor="file">Select Group Avatar</label>
                    <input type="file" name="file" id="fileInput"/>
                </div>
                <div>
                    <label htmlFor="groupname">Group Name: </label>
                    <input type="text" name="groupname" id="groupname"/>
                </div>
                <div>
                    <label htmlFor="groupdesc">Group Description: </label>
                    <textarea name="groupdesc" id="groupdesc" ></textarea>
                </div>
                <button>Make a Group</button>
            </form>
            <img src="/close.png" alt="close" className="close" onClick={props.changeMakeMode}/>
        </div>
    )
}

export default MakeGroup;