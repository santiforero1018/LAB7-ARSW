/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.blueprints.services;

import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.model.Point;
import edu.eci.arsw.blueprints.persistence.BlueprintNotFoundException;
import edu.eci.arsw.blueprints.persistence.BlueprintPersistenceException;
import edu.eci.arsw.blueprints.persistence.BlueprintsPersistence;
import edu.eci.arsw.blueprints.persistence.Filter;
// import java.util.LinkedHashMap;
// import java.util.Map;
import java.util.Set;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author hcadavid
 */
@Service
public class BlueprintsServices {

    @Autowired
    BlueprintsPersistence bpp;

    @Autowired
    Filter filter;

    /**
     * 
     * @param blueprint
     * @throws BlueprintPersistenceException
     * @throws BlueprintPersistenceException
     */
    public void addNewBlueprint(Blueprint bp) throws BlueprintPersistenceException {
        try {
            bpp.saveBlueprint(bp);
        } catch (BlueprintPersistenceException e) {
            // TODO: handle exception
            throw new BlueprintPersistenceException(e.getMessage());
        }

    }

    public Set<Blueprint> getAllBlueprints() throws BlueprintNotFoundException {
        try {
            return this.bpp.getAllBlueprints();
        } catch (BlueprintNotFoundException e) {
            throw new BlueprintNotFoundException(e.getMessage());
        }
    }

    /**
     * 
     * @param author blueprint's author
     * @param name   blueprint's name
     * @return the blueprint of the given name created by the given author
     * @throws BlueprintNotFoundException if there is no such blueprint
     */
    public Blueprint getBlueprint(String author, String name) throws BlueprintNotFoundException {
        // throw new UnsupportedOperationException("Not supported yet.");
        try {
            return this.bpp.getBlueprint(author, name);

        } catch (BlueprintNotFoundException e) {
            throw new BlueprintNotFoundException(e.getMessage());
        }
    }

    /**
     * 
     * @param author blueprint's author
     * @return all the blueprints of the given author
     * @throws BlueprintNotFoundException if the given author doesn't exist
     */
    public Set<Blueprint> getBlueprintsByAuthor(String author) throws BlueprintNotFoundException {
        try {
            return this.bpp.getBlueprintsByAuthor(author);
        } catch (BlueprintNotFoundException e) {
            throw new BlueprintNotFoundException(e.getMessage());
        }
    }

    public List<Point> getFilterPointsOneBp(String author, String bprintname) throws BlueprintNotFoundException {
        try {
            return this.filter.getPoints(this.bpp.getBlueprint(author, bprintname));
        } catch (BlueprintNotFoundException e) {
            // TODO: handle exception
            throw new BlueprintNotFoundException(e.getMessage());
        }

    }

    public void updateBluePrint(String author, String name, Blueprint nbp) throws BlueprintPersistenceException {
        try {
            this.bpp.updateBluePrint(author, name, nbp);
        } catch (BlueprintPersistenceException e) {
            throw new BlueprintPersistenceException(e.getMessage());
        }
    }

}
