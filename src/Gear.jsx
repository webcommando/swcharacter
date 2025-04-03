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
export function Gear() {
  // List of item in the gear inventory
    const [items, setItems] = useState([]);
  // Sum of the weight for the items inventory
    const [itemSum, setSum] = useState(0);
  // The current selected item from the edit button click
    const [selectedItem, setSelectedItem] = useState(
      { id:"", description:"", weight:"", name:""}
      );

  // Current tab to display 
    const [tab, setTab] = useState('1');

    useEffect(() => {
        fetchGear();
  
      }, []);

    //
    // Get a list of items in inventory from storage
    //
    async function fetchGear() {
      console.log(client.models);
        const { data: items } = await client.models.Gear.list();
        let sum = 0;
        items.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });

      for (const item in items) {
        console.log("Value:", parseFloat(items[item].weight));
        sum += parseFloat(items[item].weight);
      }
        setSum(sum);
        setItems(items);
      
    }

    // 
    // Create an item in inventory in storage
    //
    async function createItem(event) {
      event.preventDefault();
  
      const form = new FormData(event.target);
      const {data: newItem} = await client.models.Gear.create({
        name: form.get("name"),
        description: form.get("description"),
        weight: form.get("weight"),
        
      });
  
      fetchGear();
      event.target.reset();
    }
    
    //
    // Delete an item from storage
    //
    async function deleteItem({ id }) {

        const toBeDeletedNote = {
          id: id,
          
        };
    
        const { data: deletedNote } = await client.models.Gear.delete(
          toBeDeletedNote
        );
        console.log(deletedNote);
        fetchGear();
      }

      //
      // Edit an item in storage based on the selection currently defined
      //
      async function editItem (event) {
        event.preventDefault();

        const form = new FormData(event.target);
        const {data: updatedItem, errors} = await client.models.Gear.update( {
          id: selectedItem.id,
          name: form.get("name"),
          description: form.get("description"),
          weight: form.get("weight"),
      
        })
        console.log("errors:")
        console.log(errors);

        fetchGear();
        // Set the tab back to the main list display after the edit executes
        setTab("1");
        event.target.reset();
        
      }

      //
      // The UI element for a single item
      // Note the edit icon sets the tab to the edit tab and sets current selection.
      //
    function Item({aItem}) {

       // console.log(aSkill);

        return (
        <TableRow key={aItem.id}>
            <TableCell>{aItem.name} <div class="tooltip">{aItem.description.length > 0? "(view)":""}<span class="tooltiptext">{aItem.description}</span></div>
            </TableCell>
            <TableCell textAlign="right">{aItem.weight}</TableCell>

            <TableCell>
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
                    
        </TableCell>
        </TableRow>
        )
    
    }

  // Base user interface for the Gear list.  This has three tabs.  First is the list, second is a (+) with the
  // add form, and third is the edit panel which is hidden until the select icon is selected.
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
    
        <Table
          caption=""
          highlightOnHover={false}
          size="small"
          variation="striped">
                  
        <TableHead>
        <TableRow>
          <TableCell textAlign="center" as="th">Name</TableCell>
          <TableCell textAlign="center" as="th">Weight</TableCell>
          <TableCell textAlign="center" as="th"></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>

        {items.map((note) => (
            <Item aItem={note}/>
        ))}
        <TableRow>
        <TableCell textAlign="right">Sum: </TableCell>
        <TableCell textAlign="right">{itemSum}</TableCell>
        <TableCell></TableCell>
        </TableRow>
      </TableBody>
    </Table>
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
                 name="weight"
                 placeholder="Weight"
                 label="Weight"
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
                 name="weight"
                 placeholder="weight"
                 label="Weight"
                 labelHidden
                 variation="default"
                 required
                 defaultValue = {selectedItem.weight}
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