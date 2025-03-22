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

import { Skills } from "./Skill.jsx";
import { Gear } from "./Gear.jsx";

/**
 * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
 */

Amplify.configure(outputs);
const client = generateClient({
  authMode: "userPool",
});



export default function App() {
  const [notes, setNotes] = useState([]);


  const { tokens } = useTheme();


  return (
    <Authenticator>
   {({ signOut }) => (
    <View
      as="div"
      ariaLabel="Character Sheet"
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
          <Skills  />              
                
          </Card>
          <Card
           backgroundColor={tokens.colors.blue[10]}
            columnStart="2"
            columnEnd="3"
          >
            Gear
            <Gear />

            

          </Card>
          <Card
           backgroundColor={tokens.colors.blue[10]}
            columnStart="3"
            columnEnd="-1"
          >   
            Edges and Hindrances 
          
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