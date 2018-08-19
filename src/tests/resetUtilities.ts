import { Passwd } from "../classes/Passwd";
import { Group } from "../classes/Group";

export default function resetUtilities(){
    Passwd.setPath("./src/tests/fake.passwd");
    Passwd.setLineDelimiter("\n");
    Passwd.setColumnDelimiter(":");
    Group.setPath("./src/tests/fake.group");
    Group.setLineDelimiter("\n");
    Group.setColumnDelimiter(":");
};