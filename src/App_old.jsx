import { useState, useEffect } from "react";
import {
  Authenticator,
  Button,
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
//import { Skills } from "Skill.jsk"
/**
 * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
 */

Amplify.configure(outputs);
const client = generateClient({
  authMode: "userPool",
});

function SkillForm ({createFunction}) {
   return (
    <View as="form" margin="3rem 0" onSubmit={createFunction}>
    <Table
                caption=""
                highlightOnHover={false}
                size="small"
                variation="striped">
    <TableBody>
      <TableCell> 
        <TextField
        name="name"
        placeholder="name"
        label="Note Name"
        labelHidden
        variation="quiet"
        required
      /></TableCell>
      <TableCell>      <TextField
        name="description"
        placeholder="Note Description"
        label="Note Description"
        labelHidden
        variation="quiet"
        required
      /></TableCell>
      <TableCell><TextField
        name="die"
        placeholder="Note Description"
        label="Note Description"
        labelHidden
        variation="quiet"
        required
      /></TableCell>
      <TableCell>       <TextField
        name="modifier"
        placeholder="Note Description"
        label="Note Description"
        labelHidden
        variation="quiet"
        required
      /></TableCell>
      <TableCell> <Button type="submit" variation="primary">
                   (+)
      </Button>
   </TableCell>
    </TableBody>
    </Table>
    </View>
   )
}

function Skills( {theNotes}) {


  
  return (
<Table
                caption=""
                highlightOnHover={false}
                size="small"
                variation="striped">
               
    <TableHead>
    <TableRow>
      <TableCell as="th">Name</TableCell>
      <TableCell as="th">die Fruit</TableCell>
      <TableCell as="th">Description</TableCell>
      <TableCell as="th">Del</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>

    <Skill name="Walking" die="d4" description="Test" id="" />
    <Skill name="Sneaking" die="d6" description="Sneakily" id=""/>

    {theNotes.map((note) => (
        <Skill name={note.name} die="DD" description={note.description} id={note.id}/>


    ))}
  </TableBody>
</Table>

  )
}

function Skill({name, die, description, id}) {

  return (
    <TableRow>
        <TableCell>{name}</TableCell>
        <TableCell>{die}</TableCell>
        <TableCell>{description}</TableCell>
        <TableCell><Button
                   variation="destructive"
                   onClick={() => deletSkill(id)}
                 >-</Button>
   </TableCell>
    </TableRow>
  )

}

export default function App() {
  const [notes, setNotes] = useState([]);
  const [skills, setSkills] = useState([]);

  const { tokens } = useTheme();

  useEffect(() => {
    fetchSkills();
  }, []);

  async function fetchNotes() {
    const { data: notes } = await client.models.Note.list();
    await Promise.all(
      notes.map(async (note) => {
        // if (note.image) {
        //   const linkToStorageFile = await getUrl({
        //     path: ({ identityId }) => `media/${identityId}/${note.image}`,
        //   });
        //   console.log(linkToStorageFile.url);
        //   note.image = linkToStorageFile.url;
        // }
        return note;
      })
    );
    console.log(notes);
    setNotes(notes);
  }

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

  async function createNote(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    console.log(form.get("image").name);

    const { data: newNote } = await client.models.Note.create({
      name: form.get("name"),
      description: form.get("description"),
      image: form.get("image").name,
    });

    console.log(newNote);
    // if (newNote.image)
    //   if (newNote.image)
        // await uploadData({
        //   path: ({ identityId }) => `media/${identityId}/${newNote.image}`,

        //   data: form.get("image"),
        // }).result;

    fetchNotes();
    event.target.reset();
  }

  async function deleteNote({ id }) {
    const toBeDeletedNote = {
      id: id,
    };

    
    const { data: deletedNote } = await client.models.Note.delete(
      toBeDeletedNote
    );
    console.log(deletedNote);
    fetchNotes();
  }

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

  async function deleteSkill({ id }) {
    const toBeDeletedSkill = {
      id: id,
    };
    const { data: deletedSkill } = await client.models.Skill.delete(
      toBeDeletedSkill
    );
    //console.log(deletedNote);
    fetchSkills();
  }

  return (
    <Authenticator>
   {({ signOut }) => (
    <View
      as="div"
      ariaLabel="View example"
      backgroundColor="var(--amplify-colors-white)"
      borderRadius="6px"
      border="1px solid var(--amplify-colors-black)"
      boxShadow="3px 3px 5px 6px var(--amplify-colors-neutral-60)"
      color="var(--amplify-colors-blue-60)"

      maxWidth="100%"
      padding="1rem"

      >
        <Grid
          columnGap="0.5rem"
          rowGap="0.5rem"
          templateColumns="1fr 1fr 1fr"
          templateRows="1fr 1f 5fr 1fr 1fr"
        >
          <Card
            columnStart="1"
            columnEnd="-1"
            backgroundColor={tokens.colors.blue[10]}
          >
            Header
            <Button onClick={signOut}>Sign Out</Button>
          </Card>
          <Card
            columnStart="1"
            columnEnd="2"
            backgroundColor={tokens.colors.blue[10]}
          >
            Attributes
          </Card>
          <Card
            columnStart="2"
            columnEnd="3"
            backgroundColor={tokens.colors.blue[10]}
          >
            Stats
          </Card>
          <Card
            columnStart="3"
            columnEnd="-1"
            backgroundColor={tokens.colors.blue[10]}
          >
            Image
          </Card>
          <Card
            columnStart="1"
            columnEnd="2"
            backgroundColor={tokens.colors.blue[10]}
          >
            Skills
          <Skills theNotes={skills} />              
                
          </Card>
          <Card
           backgroundColor={tokens.colors.blue[10]}
            columnStart="2"
            columnEnd="3"
          >
            Gear

            <View as="form" margin="3rem 0" onSubmit={createSkill}>
             <Flex
               direction="column"
               justifyContent="center"
               gap="2rem"
               padding="2rem"
             >
               <TextField
                 name="name"
                 placeholder="Note Name"
                 label="Note Name"
                 labelHidden
                 variation="quiet"
                 required
               />
               <TextField
                 name="description"
                 placeholder="Note Description"
                 label="Note Description"
                 labelHidden
                 variation="quiet"
                 required
               />
               <TextField
                 name="die"
                 placeholder="Note Description"
                 label="Note Description"
                 labelHidden
                 variation="quiet"
                 required
               />
                <TextField
                 name="modifier"
                 placeholder="Note Description"
                 label="Note Description"
                 labelHidden
                 variation="quiet"
                 required
               />


             <Button type="submit" variation="primary">
                             Create Skill
               </Button>
             </Flex>
             </View>


          </Card>
          <Card
           backgroundColor={tokens.colors.blue[10]}
            columnStart="3"
            columnEnd="-1"
          >   
            Edges and Hindrances 
           <View as="form" margin="3rem 0" onSubmit={createNote}>
             <Flex
               direction="column"
               justifyContent="center"
               gap="2rem"
               padding="2rem"
             >
               <TextField
                 name="name"
                 placeholder="Note Name"
                 label="Note Name"
                 labelHidden
                 variation="quiet"
                 required
               />
               <TextField
                 name="description"
                 placeholder="Note Description"
                 label="Note Description"
                 labelHidden
                 variation="quiet"
                 required
               />
               <View
                 name="image"
                 as="input"
                 type="file"
                 alignSelf={"end"}
                 accept="image/png, image/jpeg"
               />

             <Button type="submit" variation="primary">
                             Create Note
               </Button>
             </Flex>
             </View>
          </Card>
          <Card
           backgroundColor={tokens.colors.blue[10]}
            columnStart="1"
            columnEnd="-1"
          >
            Powers
          </Card>
          <Card
           backgroundColor={tokens.colors.blue[10]}
            columnStart="1"
            columnEnd="-1"
          >
            Weapon
          </Card>
        </Grid>

    </View>
     )}
  </Authenticator>
  );

  // return (
  //   <Authenticator>
  //     {({ signOut }) => (
  //       <Flex
  //         className="App"
  //         justifyContent="center"
  //         alignItems="center"
  //         direction="column"
  //         width="70%"
  //         margin="0 auto"
  //       >
  //         <Heading level={1}>My Notes App</Heading>
  //         <View as="form" margin="3rem 0" onSubmit={createNote}>
  //           <Flex
  //             direction="column"
  //             justifyContent="center"
  //             gap="2rem"
  //             padding="2rem"
  //           >
  //             <TextField
  //               name="name"
  //               placeholder="Note Name"
  //               label="Note Name"
  //               labelHidden
  //               variation="quiet"
  //               required
  //             />
  //             <TextField
  //               name="description"
  //               placeholder="Note Description"
  //               label="Note Description"
  //               labelHidden
  //               variation="quiet"
  //               required
  //             />
  //             <View
  //               name="image"
  //               as="input"
  //               type="file"
  //               alignSelf={"end"}
  //               accept="image/png, image/jpeg"
  //             />

  //             <Button type="submit" variation="primary">
  //               Create Note
  //             </Button>
  //           </Flex>
  //         </View>
  //         <Divider />
  //         <Heading level={2}>Current Notes</Heading>
  //         <Grid
  //           margin="3rem 0"
  //           autoFlow="column"
  //           justifyContent="center"
  //           gap="2rem"
  //           alignContent="center"
  //         >
  //           {notes.map((note) => (
  //             <Flex
  //               key={note.id || note.name}
  //               direction="column"
  //               justifyContent="center"
  //               alignItems="center"
  //               gap="2rem"
  //               border="1px solid #ccc"
  //               padding="2rem"
  //               borderRadius="5%"
  //               className="box"
  //             >
  //               <View>
  //                 <Heading level="3">{note.name}</Heading>
  //               </View>
  //               <Text fontStyle="italic">{note.description}</Text>
  //               {note.image && (
  //                 <Image
  //                   src={note.image}
  //                   alt={`visual aid for ${notes.name}`}
  //                   style={{ width: 400 }}
  //                 />
  //               )}
  //               <Button
  //                 variation="destructive"
  //                 onClick={() => deleteNote(note)}
  //               >
  //                 Delete note
  //               </Button>
  //             </Flex>
  //           ))}
  //         </Grid>
  //         <Button onClick={signOut}>Sign Out</Button>
  //       </Flex>
  //     )}
  //   </Authenticator>
  // );
}