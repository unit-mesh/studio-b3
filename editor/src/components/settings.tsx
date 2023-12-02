import { useState } from "react";
import { Editor } from "@tiptap/core";

import { Button } from "@radix-ui/themes";
import { Cross2Icon, GearIcon } from '@radix-ui/react-icons'
import * as Dialog from '@radix-ui/react-dialog'
import * as Tabs from '@radix-ui/react-tabs'
import Select from 'react-select';

import styles from '../../styles/Home.module.css'

// all options
// don't delete this
const articleTypeOptions = [
	{ value: 'essay', label: 'Essay' },
	{ value: 'article', label: 'Article' },
	{ value: 'blog_post', label: 'Blog Post' },
	{ value: 'poetry', label: 'Poetry' },
	{ value: 'short_story', label: 'Short Story' },
	{ value: 'technical_writing', label: 'Technical Writing' },
	{ value: 'creative_writing', label: 'Creative Writing' },
	{ value: 'research_paper', label: 'Research Paper' },
	{ value: 'journalism', label: 'Journalism' },
	{ value: 'business_writing', label: 'Business Writing' },
	{ value: 'script', label: 'Script' },
	{ value: 'resume', label: 'Resume' },
	{ value: 'letter', label: 'Letter' },
	{ value: 'speech', label: 'Speech' },
	{ value: 'review', label: 'Review' },
	{ value: 'proposal', label: 'Proposal' },
];

const b3TypeOptions = [
	{ value: 'article', label: '文章' },
	{ value: 'user-story', label: '需求文档' },
];

const articleRoleOptions = [
	{ value: 'author', label: ' Author' },
	{ value: 'editor', label: 'Editor' },
	{ value: 'contributor', label: 'Contributor' },
	{ value: 'interviewer', label: 'Interviewer' },
	{ value: 'reviewer', label: 'Reviewer' },
	{ value: 'researcher', label: 'Researcher' },
	{ value: 'co-author', label: 'Co-Author' },
	{ value: 'ghostwriter', label: 'Ghostwriter' },
	{ value: 'editorial_board_member', label: 'Editorial Board Member' },
	{ value: 'columnist', label: 'Columnist' },
	{ value: 'correspondent', label: 'Correspondent' },
	{ value: 'proofreader', label: 'Proofreader' },
];

const feelLikeOptions = [
	{ value: 'informative', label: 'Informative' },
	{ value: 'inspirational', label: 'Inspirational' },
	{ value: 'educational', label: 'Educational' },
	{ value: 'entertaining', label: 'Entertaining' },
	{ value: 'thought-provoking', label: 'Thought-Provoking' },
	{ value: 'humorous', label: 'Humorous' },
	{ value: 'serious', label: 'Serious' },
	{ value: 'uplifting', label: 'Uplifting' },
	{ value: 'reflective', label: 'Reflective' },
	{ value: 'engaging', label: 'Engaging' },
	{ value: 'controversial', label: 'Controversial' },
	{ value: 'insightful', label: 'Insightful' },
	{ value: 'emotional', label: 'Emotional' },
	{ value: 'motivational', label: 'Motivational' },
	{ value: 'captivating', label: 'Captivating' },
];

export const Settings = ({ editor }: { editor: Editor }) => {
	const [articleType, setArticleType] = useState<any>(b3TypeOptions[0]);
	const [articleRole, setArticleRole] = useState<any>(articleRoleOptions[0]);
	const [articleFeel, setArticleFeel] = useState<any>(feelLikeOptions[0]);

	return <div className={'flex flex-row justify-between'}>
		<div className={'flex flex-row justify-between text-xs'}>
			<div className={'p-2 w-48'}>
				<label className={'italic text-gray-400'}>Type of writing</label>
				<Select
					defaultValue={articleType}
					onChange={(value) => {
						setArticleType(value)
					}}
					options={b3TypeOptions}
				/>
			</div>

			<div className={'p-2 w-48'}>
				<label className={'italic text-gray-400'}>Role in article</label>
				<Select
					defaultValue={articleRole}
					onChange={setArticleRole}
					options={articleRoleOptions}
				/>

			</div>

			<div className={'p-2 w-48'}>
				<label className={'italic text-gray-400'}>Feel like</label>
				<Select
					defaultValue={articleFeel}
					onChange={setArticleFeel}
					options={feelLikeOptions}
				/>
			</div>
		</div>

		<Dialog.Root>
			<Dialog.Trigger asChild>
				<Button className={styles.setting} onClick={() => {
					// show some dialog
				}}>
					<GearIcon/>
				</Button>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="DialogOverlay"/>
				<Dialog.Content className="DialogContent">
					<Dialog.Title className="DialogTitle">Custom Prompt Settings</Dialog.Title>

					<Tabs.Root className="TabsRoot" defaultValue="tab1">
						<Tabs.List className="TabsList" aria-label="Manage your account">
							<Tabs.Trigger className="TabsTrigger" value="tab1">
								Toolbar AI
							</Tabs.Trigger>
							<Tabs.Trigger className="TabsTrigger" value="tab2">
								Bubble Menu
							</Tabs.Trigger>
							<Tabs.Trigger className="TabsTrigger" value="tab3">
								Slash Command
							</Tabs.Trigger>
						</Tabs.List>
						<Tabs.Content className="TabsContent" value="tab1">
							<SettingField/>
						</Tabs.Content>
						<Tabs.Content className="TabsContent" value="tab2">
							<SettingField/>
						</Tabs.Content>
						<Tabs.Content className="TabsContent" value="tab3">
							<SettingField/>
						</Tabs.Content>
					</Tabs.Root>

					<Dialog.Close asChild>
						<button className="IconButton" aria-label="Close">
							<Cross2Icon/>
						</button>
					</Dialog.Close>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	</div>
}

const SettingField = ({ label, children }: any) => (
	<textarea id="message"
	          rows={12}
	          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
	          placeholder="Write your thoughts here..."></textarea>
)