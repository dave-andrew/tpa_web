import { useQuery } from "@apollo/client"
import { getReelCommentReply } from "../apollo/reelquery"
import { useState } from "react"


export default function ReelReply({ reel, comment, setRepliedUser, setRepliedComment }: any) {

    const [reply, setReply] = useState<any[]>([]);

    const { loading } = useQuery(getReelCommentReply, {
        variables: {
            reelid: reel,
            commentid: comment.ID
        },
        onCompleted: (data) => {
            setReply(data?.getReelCommentReply);
        }
    })

    const markup = (message: string) => {
        return { __html: message }
    }

    if (loading) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    return (
        <div>
            {reply.map((data: any) => {
                return (
                    <div className="flex mt-10">
                        <img src={data.User.ProfilePicture} alt="" className="circle" />
                        <div className="flex flex-col gap-5">
                            <div className="bold">{data.User.Name}</div>
                            <div dangerouslySetInnerHTML={markup(data.Message)}></div>
                            <div className="reply" onClick={() => {
                                setRepliedComment(comment);
                                setRepliedUser(data.User.Name);
                            }}>Reply</div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}