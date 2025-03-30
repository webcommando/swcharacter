import { useState, useEffect } from "react";
import {
  Authenticator,
  Button,
  Tabs,
  Text,
  TextField,
  TextAreaField,
  Heading,
  Flex,
  View,
  Image,
  Grid,
  Divider,
  Card,
  useTheme,
  Accordion,
  SelectField,
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
import  {EdgesDefinition} from "./data/EdgesDefinitions.jsx";


/**
 * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
 */

//Amplify.configure(outputs);
const client = generateClient({
  authMode: "userPool",
});

//
//
// Gear display object 
//
//
export function Edges() {
  // List Edges the user has
    const [edges, setEdges] = useState([]);
  
  // The current selected Edge from the edit button click
    const [selectedItem, setSelectedItem] = useState(
      { id:"", description:"", requirements:"", name:""}
      );

  // Current tab to display 
    const [tab, setTab] = useState('1');

    useEffect(() => {
        fetchEdges();
  
      }, []);

    //
    // Get a list of Edges from storage.
    //
    async function fetchEdges() {
      console.log(client.models);
        const { data: items } = await client.models.Edge.list();
 
        items.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });

        setEdges(items);
      
    }

    // 
    // Display the list of options for the UI
    //
     function Edgeoptions() {

    // the name of the select field is called "EdgesList"
      return (
          <SelectField
            label="EdgesList"
            name="EdgesList"
            labelHidden
            descriptiveText="Select Existing Edge"
          >
            <option value="CUSTOM">Custom Edge - Enter Below</option>
                {EdgesDefinition.map((edge) => (
                    <option value={edge.name}>{edge.name}</option>
                ))}
              
          </SelectField>
      );
    }

    //
    // Add an Edge from a list of standard edges.
    //
    async function createStandardEdge(event) {
      event.preventDefault();
  
      const form = new FormData(event.target);
      
      // get the value from "EdgesList"
      const name = form.get("EdgesList");

      // Iterate through the definition list to find the right one. 
      // not the fastest but there are a limit to the number of Edges
      for (const i in EdgesDefinition) {

        //console.log("inbound:" + name + " Loop:", EdgesDefinition[i].name);

        // if the name matches use that data to store
        if (EdgesDefinition[i].name === name) {
          console.log("Made it to create locations!")

          const {data: newSkill} = await client.models.Edge.create({
              name: name,
              description: EdgesDefinition[i].description,
              requirements: EdgesDefinition[i].requirements,
             
            });


        };

      }
  
      fetchEdges();
      event.target.reset();
    }

    // 
    // Create an Edge from the form data (Custom Edge)
    //
    async function createEdge(event) {
      event.preventDefault();
  
      const form = new FormData(event.target);
      const {data: newItem} = await client.models.Edge.create({
        name: form.get("name"),
        description: form.get("description"),
       requirements: form.get("requirements"),
        
      });
  
      fetchEdges();
      event.target.reset();
    }
    
    //
    // Delete an Edge from storage
    //
    async function deleteEdge({ id }) {
        
        const toBeDeletedNote = {
          id: id,
          
        };
    
        const { data: deletedNote } = await client.models.Edge.delete(
          toBeDeletedNote
        );

        console.log(deletedNote);
        fetchEdges();
      }

      //
      // Edit an Edge in storage based on the selection
      //
      async function editEdge (event) {
        event.preventDefault();

        const form = new FormData(event.target);
        const {data: updatedItem, errors} = await client.models.Edge.update( {
          id: selectedItem.id,
          name: form.get("name"),
          description: form.get("description"),
          requirements: form.get("requirements"),
      
        })
        console.log("errors:")
        console.log(errors);

        fetchEdges();

        // Go back to the first tab after the edit executes
        setTab("1");
        event.target.reset();
        
      }

      //
      // The UI element for a single Edge - uses an accordian discplay with description and 
      // edit / delete icons. Note the edit icon, sets tab display for the third tab and sets the 
      // selected item.
      //
    function Edge({aItem}) {

       // console.log(aSkill);

        return (

            <Accordion.Item value={aItem.id}>
        <Accordion.Trigger>
            {aItem.name}
          <Accordion.Icon />
        </Accordion.Trigger>
        <Accordion.Content>
         <p>
          {aItem.description}
          </p><p>
            <Image
                alt="Add"
                src={MinusImage}
                objectFit="initial"

                backgroundColor="initial"
                height="20px"
                width="20px"
                opacity="100%"
                onClick={() => deleteEdge(aItem)}
                />

            <Image
                alt="Edit"
                src={EditImage}
                objectFit="initial"

                backgroundColor="initial"
                height="20px"
                width="20px"
                opacity="100%"
                onClick={() => {setTab('3'); setSelectedItem(aItem);}}
                />
                </p>
        <p>Requirements: {aItem.requirements}</p>
    </Accordion.Content>
    </Accordion.Item>

        )
    
    }


 // The base user interface.  Includes three tabs.  One is the list, second is the + sign and the add,
 // third is hidden but hold the edit function that is displyed on the click of edit icon.
  return (
    <View>
    <Tabs.Container  defaultValue='1' value={tab} onValueChange={(tab) => setTab(tab)} color="var(--amplify-colors-blue-60)">
    <Tabs.List indicatorPosition="top">
      <Tabs.Item value="1">Edges</Tabs.Item>
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
    


    <Accordion.Container>
    {edges.map((note) => (
            <Edge aItem={note}/>
        ))}
 
    </Accordion.Container>



    </Tabs.Panel>
    <Tabs.Panel value="2">
    <View as="form" margin="3rem 0" onSubmit={createStandardEdge}>
    <Flex
               direction="column"
               justifyContent="center"
               gap="2rem"
               padding="2rem"
             >

      <Edgeoptions />
      
      <Button type="submit" variation="primary">
                             Existing Edge
               </Button>
    </Flex>
     </View>
      <View as="form" margin="3rem 0" onSubmit={createEdge}>
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
               <TextAreaField
                 name="description"
                 placeholder="Description"
                 label="Description"
                 labelHidden
                 variation="default"
                 
               />
               <TextField
                 name="requirements"
                 placeholder="requirements"
                 label="requirements"
                 labelHidden
                 variation="default"
                 required
               />


             <Button type="submit" variation="primary">
                             Create Edge
               </Button>
             </Flex>
             </View>
</Tabs.Panel>
<Tabs.Panel value="3">
<View as="form" margin="3rem 0" onSubmit={editEdge}>
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
                 defaultValue = {selectedItem.name}
               />
               <TextAreaField
                 name="description"
                 placeholder="Description"
                 label="Description"
                 labelHidden
                 variation="default"
                 
                 defaultValue = {selectedItem.description}
               />
               <TextField
                 name="requirements"
                 placeholder="requirements"
                 label="requirements"
                 labelHidden
                 variation="default"
                 required
                 defaultValue = {selectedItem.requirements}
               />

             <Button type="submit" variation="primary">
                             Edit Edge
               </Button>
             </Flex>
             </View>
</Tabs.Panel>
</Tabs.Container>
</View>
  )
}