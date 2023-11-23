import { Cross2Icon, GearIcon } from '@radix-ui/react-icons'
import * as Dialog from '@radix-ui/react-dialog'
import * as Tabs from '@radix-ui/react-tabs'

import styles from '../styles/Home.module.css'

export const Settings = () => {
  return <Dialog.Root>
    <Dialog.Trigger asChild>
      <div className={styles.setting}>
        <button onClick={() => {
          // show some dialog
        }}>
          <GearIcon/>
        </button>
      </div>
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
}

const SettingField = ({ label, children }) => (
  <textarea id="message" rows="4"
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Write your thoughts here..."></textarea>
)