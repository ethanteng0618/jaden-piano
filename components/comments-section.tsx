'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export function CommentsSection({ itemId, itemType, isAdmin }: { itemId: string, itemType: string, isAdmin: boolean }) {
    const [comments, setComments] = useState<any[]>([])
    const [newComment, setNewComment] = useState('')
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUser(data.user))
        fetchComments()
    }, [itemId])

    async function fetchComments() {
        const { data } = await supabase
            .from('comments')
            .select('*, profiles(email, full_name, role)')
            .eq('item_id', itemId)
            .eq('item_type', itemType)
            .order('created_at', { ascending: false })

        if (data) setComments(data)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!newComment.trim() || !user) return

        const { error } = await supabase.from('comments').insert({
            item_id: itemId,
            item_type: itemType,
            user_id: user.id,
            content: newComment
        })

        if (!error) {
            setNewComment('')
            fetchComments()
        } else {
            alert('Failed to post comment')
        }
    }

    async function deleteComment(id: string) {
        if (!confirm('Delete this comment?')) return

        const { error } = await supabase.from('comments').delete().eq('id', id)
        if (!error) {
            fetchComments()
        } else {
            alert('Failed to delete comment')
        }
    }

    return (
        <div className="mt-6 space-y-4">
            <h4 className="font-semibold text-lg">Comments</h4>

            {user ? (
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1"
                    />
                    <Button type="submit">Post</Button>
                </form>
            ) : (
                <p className="text-sm text-muted-foreground">Sign in to leave a comment.</p>
            )}

            <div className="space-y-3 mt-4">
                {comments.map((comment) => (
                    <div key={comment.id} className="p-3 bg-muted/50 rounded-lg flex justify-between items-start gap-4">
                        <div>
                            <p className="text-xs font-semibold text-primary mb-1">
                                {comment.profiles?.full_name || comment.profiles?.email || 'User'}
                            </p>
                            <p className="text-sm text-foreground">{comment.content}</p>
                        </div>

                        {isAdmin && (
                            <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive shrink-0" onClick={() => deleteComment(comment.id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                ))}

                {comments.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No comments yet. Be the first!</p>
                )}
            </div>
        </div>
    )
}
