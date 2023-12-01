import { v4 } from 'uuid'

export interface Comment {
	id: string
	content: string
	replies: Comment[]
	createdAt: Date
}

export const getNewComment = (content: string): Comment => {
	return {
		id: `a${v4()}a`,
		content,
		replies: [],
		createdAt: new Date()
	}
}
