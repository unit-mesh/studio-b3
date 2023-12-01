import { v4 } from 'uuid'

export interface Advice {
	id: string
	content: string
	replies: Advice[]
	createdAt: Date
}

export const getNewComment = (content: string): Advice => {
	return {
		id: `a${v4()}a`,
		content,
		replies: [],
		createdAt: new Date()
	}
}
