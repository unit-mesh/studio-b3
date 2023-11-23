import {FacetType, OutputForm, PromptAction} from "@/types/custom-action.type";

const MenubarPrompts: PromptAction[] = [
  {
    name: 'File',
    template: '',
    facetType: FacetType.TOOLBAR_MENU,
    outputForm: OutputForm.CHAT,
  }
];
