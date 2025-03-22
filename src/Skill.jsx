import { useState, useEffect } from "react";
import {
  Authenticator,
  Button,
  Tabs,
  Text,
  TextField,
  Heading,
  Flex,
  View,
  Image,
  Grid,
  Divider,
  Card,
  useTheme,
  Table, TableCell, TableBody, TableHead, TableRow,
} from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import { getUrl } from "aws-amplify/storage";
import { uploadData } from "aws-amplify/storage";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";
import { NotificationRule } from "aws-cdk-lib/aws-codestarnotifications";

/**
 * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
 */

//Amplify.configure(outputs);
const client = generateClient({
  authMode: "userPool",
});

export function Skills() {
    const [skills, setSkills] = useState([]);

    useEffect(() => {
        fetchSkills();
      }, []);

    async function fetchSkills() {
        const { data: skills } = await client.models.Skill.list();
        setSkills(skills);

    }

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
    
    async function deleteSkill({ id }) {
        console.log("--------------")
        console.log(id);
        console.log("--------------")
        const toBeDeletedNote = {
          id: id,
        };
    
        const { data: deletedNote } = await client.models.Skill.delete(
          toBeDeletedNote
        );
        console.log(deletedNote);
        fetchSkills();
      }


    function Skill({aSkill}) {

       // console.log(aSkill);

        return (
        <TableRow key={aSkill.id}>
            <TableCell>{aSkill.name}</TableCell>
            <TableCell>{aSkill.die}</TableCell>
            <TableCell>{aSkill.modifier}</TableCell>
            <TableCell><Button
                        variation="destructive"
                        onClick={() => deleteSkill(aSkill)}
                    >-</Button>
        </TableCell>
        </TableRow>
        )
    
    }


  return (
    <View>
    <Tabs.Container  defaultValue='1'>
    <Tabs.List indicatorPosition="top">
      <Tabs.Item value="1">Skills</Tabs.Item>
      <Tabs.Item value="2">Add</Tabs.Item>
    </Tabs.List>
    <Tabs.Panel value="1">
    
    <Table
            caption=""
            highlightOnHover={false}
            size="small"
            variation="striped">
               
    <TableHead>
    <TableRow>
      <TableCell as="th">Name</TableCell>
      <TableCell as="th">Die</TableCell>
      <TableCell as="th">Mod</TableCell>
      <TableCell as="th"></TableCell>
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
                 variation="quiet"
                 required
               />
               <TextField
                 name="description"
                 placeholder="Description"
                 label="Description"
                 labelHidden
                 variation="quiet"
                 required
               />
               <TextField
                 name="die"
                 placeholder="die sides"
                 label="Sides"
                 labelHidden
                 variation="quiet"
                 required
               />
                <TextField
                 name="modifier"
                 placeholder="Modifier"
                 label="Modifier"
                 labelHidden
                 variation="quiet"
                 required
               />


             <Button type="submit" variation="primary">
                             Create Skill
               </Button>
             </Flex>
             </View>
</Tabs.Panel>
</Tabs.Container>
</View>
  )
}