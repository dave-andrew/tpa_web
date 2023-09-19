import { useQuery } from "@apollo/client";
import { getGroupReply } from "../apollo/grouppostmutation";


export default function GroupReply({ post, comment, markup, setRepliedUser, setComment }: any) {

    const { loading, data } = useQuery(getGroupReply, {
        variables: {
            postid: post,
            commentid: comment.ID
        }
    });

    if(loading){
        return (
            <div>Loading...</div>
        )
    }

    if(data){
        console.log(data);
    }

    return (
        <div>
            {data?.getGroupReply.map((reply: any) => {
                return (
                    <div className="flex mt-10" style={{marginLeft: "50px"}}>
                        <img src={reply.User.ProfilePicture} alt="" className="circle" />
                        <div className="flex flex-col ml-10 gap-5">
                            <div className="bold">{reply.User.Name}</div>
                            <div className="mt-3" dangerouslySetInnerHTML={markup(reply.Message)} style={{fontSize: "13px"}}></div>
                            <div className="reply" onClick={() => {
                                setRepliedUser(reply.User.Name);
                                setComment(comment)
                            }}>Reply</div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}