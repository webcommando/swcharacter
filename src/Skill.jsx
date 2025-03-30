import { useState, useEffect } from "react";
import {
  Authenticator,
  Button,
  Tabs,
  Text,
  TextField,
  SelectField,
  Heading,
  Flex,
  View,
  Image,
  Grid,
  Divider,
  Card,
  useTheme,
  Table, TableCell, TableBody, TableHead, TableRow,
  Input,
} from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import { getUrl } from "aws-amplify/storage";
import { uploadData } from "aws-amplify/storage";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";
import { NotificationRule } from "aws-cdk-lib/aws-codestarnotifications";

import PlusImage from "./assets/plus.svg";
import MinusImage from "./assets/minus.svg";
import EditImage from "./assets/edit.svg";

import {SkillDefinitions} from "./data/SkillDefinition.jsx";


/**
 * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
 */

//Amplify.configure(outputs);
const client = generateClient({
  authMode: "userPool",
});

//
// Skills display object
//
export function Skills() {
  // List of skills in the database
  const [skills, setSkills] = useState([]);
   // The currently selected skill from clickin gon the edit icon
  const [selectedSkill, setSelectedSkill] = useState(
    { id:"", description:"", modifier:"", name:"", die:""}
    );

  // Current Tab to display
  const [tab, setTab] = useState('1');

  useEffect(() => {
      fetchSkills();

    }, []);

    // 
    // Display the list of options for the UI.  SkillList is the selection element.
    //
     function Skilloptions() {

      return (
          <SelectField
            label="SkillList"
            name="SkillList"
            labelHidden
            descriptiveText="Select Existing Skill"
          >
            <option value="CUSTOM">Custom Skill - Enter Below</option>
                {SkillDefinitions.map((skill) => (
                    <option value={skill.name}>{skill.name}</option>
                ))}
              
          </SelectField>
      );
    }

    //
    // Get a list of the skills in the database.
    //
    async function fetchSkills() {
        const { data: skills } = await client.models.Skill.list();
        skills.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
        setSkills(skills);
      
    }

    //
    // Add a skill to the database from an onClick event of the custom input form
    //
    async function createSkill(event) {
      event.preventDefault();
  
      const form = new FormData(event.target);
      const {data: newSkill} = await client.models.Skill.create({
        name: form.get("name"),
        description: form.get("description"),
        die: form.get("die"),
        modifier: form.get("modifier")
      });
  
      fetchSkills();
      event.target.reset();
    }

    //
    // Add a skill to the database from the list of standard skills list form
    //
    async function createStandardSkill(event) {
      event.preventDefault();
  
      const form = new FormData(event.target);
      
      // SkillList is the selection element
      const name = form.get("SkillList");
      console.log("Skill:", name);

      // Search through the defined list for a match and then store it.
      // A list is not the most efficient but there is a fairly limited list
      for (const i in SkillDefinitions) {

        console.log("inbound:" + name + " Loop:", SkillDefinitions[i].name);

        if (SkillDefinitions[i].name === name) {
          console.log("Made it to create locations!")

          // We default to "4" and "0" Modifier for a new skill. 
          const {data: newSkill} = await client.models.Skill.create({
              name: name,
              description: SkillDefinitions[i].description,
              die: "4",
              modifier: "0"
            });


        };

      }
  
      fetchSkills();
      event.target.reset();
    }
    
    //
    // Delete a skill from the database
    //
    async function deleteSkill({ id }) {
  
        const toBeDeletedNote = {
          id: id,
          
        };
    
        const { data: deletedNote } = await client.models.Skill.delete(
          toBeDeletedNote
        );
        console.log(deletedNote);
        fetchSkills();
      }

      //
      // Update the information on a skill from the edit form.
      //
      async function editSkill (event) {
        event.preventDefault();

        const form = new FormData(event.target);
        const {data: updatedSkill, errors} = await client.models.Skill.update( {
          id: selectedSkill.id,
          name: form.get("name"),
          description: form.get("description"),
          die: form.get("die"),
          modifier: form.get("modifier")
        })
        console.log("errors:")
        console.log(errors);

        fetchSkills();
        setTab("1");
        event.target.reset();
        
      }

      //
      // The UI element for a row of the skill table.  Include an icon for deleting and editing
      // Note: the edit icon switches to hidden tab and sets the current selected item for the edit tab.
      //
    function Skill({aSkill}) {

       // console.log(aSkill);

        return (
        <TableRow key={aSkill.id}>
            <TableCell>{aSkill.name}</TableCell>
            <TableCell textAlign="right">{aSkill.die}</TableCell>
            <TableCell textAlign="right">{aSkill.modifier}</TableCell>
            <TableCell>
            <Image
                alt="Add"
                src={MinusImage}
                objectFit="initial"

                backgroundColor="initial"
                height="20px"
                width="20px"
                opacity="100%"
                onClick={() => deleteSkill(aSkill)}
              />

            <Image
                alt="Edit"
                src={EditImage}
                objectFit="initial"

                backgroundColor="initial"
                height="20px"
                width="20px"
                opacity="100%"
                onClick={() => {setTab('3'); setSelectedSkill(aSkill);}}
              />
                    
        </TableCell>
        </TableRow>
        )
    
    }

    //
    // Return the main UI for the skill list.  This includes three tabs. One, the main skill list. Second includes the 
    // update pane. Third, a hidden edit tab.
    //
  return (
    <View>
    <Tabs.Container  defaultValue='1' value={tab} onValueChange={(tab) => setTab(tab)} color="var(--amplify-colors-blue-60)">
    <Tabs.List indicatorPosition="top">
      <Tabs.Item value="1">Skills</Tabs.Item>
      <Tabs.Item value="2">
        <Image
            alt="Add"
            src={PlusImage}
            objectFit="initial"
            objectPosition="50% 50%"
            backgroundColor="initial"
            height="20px"
            width="20px"
            opacity="100%"
          />
      </Tabs.Item>
      <Tabs.Item value="3" isDisabled></Tabs.Item>
    </Tabs.List>


    <Tabs.Panel value="1">
    
        <Table
                caption=""
                highlightOnHover={false}
                size="small"
                variation="striped">
                  
        <TableHead>
        <TableRow>
          <TableCell textAlign="center" as="th">Name</TableCell>
          <TableCell textAlign="center" as="th">Die</TableCell>
          <TableCell textAlign="center" as="th">Mod</TableCell>
          <TableCell textAlign="center" as="th"></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>

        {skills.map((note) => (
            <Skill aSkill={note}/>
        ))}
      </TableBody>
    </Table>
  </Tabs.Panel>
  <Tabs.Panel value="2">

    <View as="form" margin="3rem 0" onSubmit={createStandardSkill}>
    <Flex
               direction="column"
               justifyContent="center"
               gap="2rem"
               padding="2rem"
             >

      <Skilloptions />
      
      <Button type="submit" variation="primary">
                             Existing Skill
               </Button>
    </Flex>
     </View>
      <View as="form" margin="3rem 0" onSubmit={createSkill}>
             <Flex
               direction="column"
               justifyContent="center"
               gap="2rem"
               padding="2rem"
             >


               <TextField
                 name="name"
                 placeholder="Name"
                 label="Name"
                 labelHidden
                 variation="default"
                 required
               />
               <TextField
                 name="description"
                 placeholder="Description"
                 label="Description"
                 labelHidden
                 variation="default"
                 required
               />
               <TextField
                 name="die"
                 placeholder="die sides"
                 label="Sides"
                 labelHidden
                 variation="default"
                 required
               />
                <TextField
                 name="modifier"
                 placeholder="Modifier"
                 label="Modifier"
                 labelHidden
                 variation="default"
                 required
               />


             <Button type="submit" variation="primary">
                             Custom Skill
               </Button>
             </Flex>
             </View>
</Tabs.Panel>
<Tabs.Panel value="3">
<View as="form" margin="3rem 0" onSubmit={editSkill}>
             <Flex
               direction="column"
               justifyContent="center"
               gap="2rem"
               padding="2rem"
             >

               <TextField
                 name="name"
                 placeholder="Name"
                 label="Name"
                 labelHidden
                 variation="default"
                 required
                 defaultValue = {selectedSkill.name}
               />
               <TextField
                 name="description"
                 placeholder="Description"
                 label="Description"
                 labelHidden
                 variation="default"
                 
                 defaultValue = {selectedSkill.description}
               />
               <TextField
                 name="die"
                 placeholder="die sides"
                 label="Sides"
                 labelHidden
                 variation="default"
                 required
                 defaultValue = {selectedSkill.die}
               />
                <TextField
                 name="modifier"
                 placeholder="Modifier"
                 label="Modifier"
                 labelHidden
                 variation="default"
                 
                 defaultValue={selectedSkill.modifier}
               />


             <Button type="submit" variation="primary">
                             Edit Skill
               </Button>
             </Flex>
             </View>
</Tabs.Panel>
</Tabs.Container>
</View>
  )
}