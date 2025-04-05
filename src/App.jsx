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
import {Attributes} from "./Attributes.jsx";
import {Edges} from "./Edges.jsx";

/**
 * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
 */

Amplify.configure(outputs);
const client = generateClient({
  authMode: "userPool",
});


//
// Main application UI element
//
export default function App() {
  const [notes, setNotes] = useState([]);
  const [skillDescription, setSkillDescription] = useState("");


  const { tokens } = useTheme();

  // function handleDescription({desc}) {
  //   setSkillDescription(desc);
  // }

  const handleDescription = (childState) => {
    setSkillDescription(childState);
  };

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
            <Flex><div><Button onClick={signOut}>Sign Out</Button></div><div>Example React Data Management Application with AWS.</div></Flex>
            
          </Card>
          <Card
            columnStart="1"
            columnEnd="2"
            backgroundColor={tokens.colors.blue[10]}
          >
            Attributes
            <Attributes />
          </Card>
          <Card
            columnStart="2"
            columnEnd="3"
            backgroundColor={tokens.colors.blue[10]}
          >
            Notes:
            <p>This page displays a multi-tier React based database application that uses React with AWS Amplify backend. This is a single page using a grid layout.
              Each section is independent within the page and demostrates one aspect of React/Database interaction.
            </p>
            <p>The Attributes section demonstrates in-line editing where the database is continuously updated for any changes to the 
              user interface elements. 
            </p>
            
          </Card>
          <Card
            columnStart="3"
            columnEnd="-1"
            backgroundColor={tokens.colors.blue[10]}
          >
            Notes (continued):
            <p>The Skills section shows a traditional Create, Edit, Delete application.  The plus button brings up an entry page
              that includes the ability to select from a drop down of standard skills or enter a custom one. Each line also includes a
              edit icon and delete icon.
            </p>
            <p>The Gear section has a similar design to the Skills section but includes a calculation for the values in the list.</p>
            <p>Finally, the Edges section provides an Accordian view of the data stored for each edge but also includes the same
              create, edit and delete functionality.
            </p>
          </Card>
          <Card
            columnStart="1"
            columnEnd="2"
            backgroundColor={tokens.colors.blue[10]}
          >
            
          <Skills  />              
                
          </Card>
          <Card
           backgroundColor={tokens.colors.blue[10]}
            columnStart="2"
            columnEnd="3"
          >
            
            <Gear />

            

          </Card>
          <Card
           backgroundColor={tokens.colors.blue[10]}
            columnStart="3"
            columnEnd="-1"
          >   
        <Edges />
          
          </Card>
          <Card
           backgroundColor={tokens.colors.blue[10]}
            columnStart="1"
            columnEnd="-1"
          >
            
          </Card>
          <Card
           backgroundColor={tokens.colors.blue[10]}
            columnStart="1"
            columnEnd="-1"
          >
            Carl Davis 2025
          </Card>
        </Grid>

    </View>
     )}
  </Authenticator>
  );

}