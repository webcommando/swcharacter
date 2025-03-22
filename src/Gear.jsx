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

export function Gear() {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(
      { id:"", description:"", weight:"", name:""}
      );
    const [tab, setTab] = useState('1');

    useEffect(() => {
        fetchGear();
  
      }, []);


    async function fetchGear() {
      console.log(client.models);
        const { data: items } = await client.models.Gear.list();
        setItems(items);
      
    }

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
    
    async function deleteItem({ id }) {
        console.log("--------------")
        console.log(id);
        console.log("--------------")
        const toBeDeletedNote = {
          id: id,
          
        };
    
        const { data: deletedNote } = await client.models.Gear.delete(
          toBeDeletedNote
        );
        console.log(deletedNote);
        fetchGear();
      }

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
        setTab("1");
        event.target.reset();
        
      }

    function Item({aItem}) {

       // console.log(aSkill);

        return (
        <TableRow key={aItem.id}>
            <TableCell>{aItem.name}</TableCell>
            <TableCell>{aItem.weight}</TableCell>

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
          <TableCell as="th">Name</TableCell>
          <TableCell as="th">Weight</TableCell>
          <TableCell as="th"></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>

        {items.map((note) => (
            <Item aItem={note}/>
        ))}
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
                 variation="quiet"
                 required
               />
               <TextAreaField
                 name="description"
                 placeholder="Description"
                 label="Description"
                 labelHidden
                 variation="quiet"
                 required
               />
               <TextField
                 name="weight"
                 placeholder="Weight"
                 label="Weight"
                 labelHidden
                 variation="quiet"
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
                 variation="quiet"
                 required
                 defaultValue = {selectedItem.name}
               />
               <TextAreaField
                 name="description"
                 placeholder="Description"
                 label="Description"
                 labelHidden
                 variation="quiet"
                 required
                 defaultValue = {selectedItem.description}
               />
               <TextField
                 name="weight"
                 placeholder="weight"
                 label="Weight"
                 labelHidden
                 variation="quiet"
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