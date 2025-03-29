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
  // List of item in the gear inventory
    const [edges, setEdges] = useState([]);
  
  // The current selected item from the edit button click
    const [selectedItem, setSelectedItem] = useState(
      { id:"", description:"", requirements:"", name:""}
      );

  // Current tab to display 
    const [tab, setTab] = useState('1');

    useEffect(() => {
        fetchGear();
  
      }, []);

    //
    // Get a list of items in inventory from storage
    //
    async function fetchEdges() {
      console.log(client.models);
        const { data: items } = await client.models.Edge.list();
 
        items.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });

        setItems(items);
      
    }

    // 
    // Create an item in inventory in storage
    //
    async function createEdge(event) {
      event.preventDefault();
  
      const form = new FormData(event.target);
      const {data: newItem} = await client.models.Edge.create({
        name: form.get("name"),
        description: form.get("description"),
       requirements: form.get("requirement"),
        
      });
  
      fetchEdges();
      event.target.reset();
    }
    
    //
    // Delete an item from storage
    //
    async function deleteItem({ id }) {
        console.log("--------------")
        console.log(id);
        console.log("--------------")
        const toBeDeletedNote = {
          id: id,
          
        };
    
        const { data: deletedNote } = await client.models.Edge.delete(
          toBeDeletedNote
        );
        console.log(deletedNote);
        fetchGear();
      }

      //
      // Edit an item in storage based on the selections
      //
      async function editItem (event) {
        event.preventDefault();
        const form = new FormData(event.target);
        const {data: updatedItem, errors} = await client.models.Edge.update( {
          id: selectedItem.id,
          name: form.get("name"),
          description: form.get("description"),
          requirements: form.get("requirement"),
      
        })
        console.log("errors:")
        console.log(errors);

        fetchGear();
        setTab("1");
        event.target.reset();
        
      }

      //
      // The UI element for a single item
      //
    function Edge({aItem}) {

       // console.log(aSkill);

        return (

            <Accordion.Item value="Accordion-item">
        <Accordion.Trigger>
            {aItem.name}
          <Accordion.Icon />
        </Accordion.Trigger>
        <Accordion.Content>
          {aItem.description}

            <Image
                        alt="Add"
                        src={MinusImage}
                        objectFit="initial"
     
                        backgroundColor="initial"
                        height="20px"
                        width="20px"
                        opacity="100%"
                        onClick={() => deleteItem(aItem)}
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
    </Accordion.Content>
    </Accordion.Item>

        )
    
    }


  return (
    <View>
    <Tabs.Container  defaultValue='1' value={tab} onValueChange={(tab) => setTab(tab)} color="var(--amplify-colors-blue-60)">
    <Tabs.List indicatorPosition="top">
      <Tabs.Item value="1">Gear</Tabs.Item>
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
    
    <Flex
  direction="row"
  justifyContent="flex-start"
  alignItems="stretch"
  alignContent="flex-start"
  wrap="nowrap"
  gap="1rem"
    >

    <Accordion.Container>
    {edges.map((note) => (
            <Edge aItem={note}/>
        ))}
      <Accordion.Item value="Accordion-item">
        <Accordion.Trigger>
          What is an Accordion?
          <Accordion.Icon />
        </Accordion.Trigger>
        <Accordion.Content>
          An Accordion contains all the parts of a collapsible section.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="unique-value">
        <Accordion.Trigger>
          This is the item title
          <Accordion.Icon />
        </Accordion.Trigger>
        <Accordion.Content>
          The `children` of the Accordion are displayed here.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Container>


</Flex>

 

    </Tabs.Panel>
    <Tabs.Panel value="2">
      <View as="form" margin="3rem 0" onSubmit={createItem}>
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
                             Create Item
               </Button>
             </Flex>
             </View>
</Tabs.Panel>
<Tabs.Panel value="3">
<View as="form" margin="3rem 0" onSubmit={editItem}>
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
                             Edit Item
               </Button>
             </Flex>
             </View>
</Tabs.Panel>
</Tabs.Container>
</View>
  )
}