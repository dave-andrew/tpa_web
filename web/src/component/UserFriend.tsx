import { useQuery } from '@apollo/client';
import { useState } from 'react';
import { getUserFriend } from '../apollo/friendquery';
import { useNavigate } from 'react-router-dom';


export default function UserFriend({ userid }: any) {

    const navigate = useNavigate();

    const [friendList, setFriendList] = useState<any[]>([]);

    const { loading, error } = useQuery(getUserFriend, {
        variables: {
            userid: userid,
        }, onCompleted: (data) => {
            setFriendList(data.getUserFriend);
        }
    });

    console.log(friendList);

    if (loading) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    if (error) {
        console.log(error)
    }

    return (
        <div className="user-friend-container">
            <div className='user-friend-list'>
                <div className='bold font-18'>Friend List: </div>
                {friendList.map((friend: any, index: number) => (
                    <div className='flex items-center gap-10 user-friend-item' onClick={() => {
                        navigate(`/profile/${friend.Name}`, { replace: true })
                    }}>
                        <div>{index + 1}. </div>
                        <div className='flex items-center'>
                            <img src={friend.ProfilePicture} alt="" className='circle' />
                            <div className="user-friend-name">
                                {friend.Name}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}