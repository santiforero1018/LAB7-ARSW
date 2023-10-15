/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.blueprints.persistence.impl;

import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.model.Point;
import edu.eci.arsw.blueprints.persistence.BlueprintNotFoundException;
import edu.eci.arsw.blueprints.persistence.BlueprintPersistenceException;
import edu.eci.arsw.blueprints.persistence.BlueprintsPersistence;

// import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Set;

import org.springframework.stereotype.Service;

/**
 *
 * @author hcadavid
 */
@Service
public class InMemoryBlueprintPersistence implements BlueprintsPersistence {

    private final Map<Tuple<String, String>, Blueprint> blueprints = new ConcurrentHashMap<>();

    public InMemoryBlueprintPersistence() {

        Blueprint bp1 = new Blueprint("john", "thepaint", new Point[] { new Point(0, 0), new Point(10, 10) });

        Blueprint bp2 = new Blueprint("Martha", "thepaint1", new Point[] { new Point(100, 100), new Point(100, 400) , new Point(400, 400), new Point(400, 100) });

        Blueprint bp3 = new Blueprint("john", "thepaint2", new Point[] { new Point(16, 7), new Point(30, 30) });

        try {
            this.saveBlueprint(bp1);
            this.saveBlueprint(bp2);
            this.saveBlueprint(bp3);
        } catch (Exception e) {
            // TODO: handle exception
        }
    }

    @Override
    public Set<Blueprint> getAllBlueprints() throws BlueprintNotFoundException {
        Set<Blueprint> resp = new HashSet<>();

        for (Map.Entry<Tuple<String, String>, Blueprint> space : blueprints.entrySet()) {
            resp.add(space.getValue());
        }
        if (resp.isEmpty()) {
            throw new BlueprintNotFoundException("Error 404 NOT FOUND: trying to find blueprints");
        }
        return resp;
    }

    @Override
    public void saveBlueprint(Blueprint bp) throws BlueprintPersistenceException {
        if (blueprints.putIfAbsent(new Tuple<>(bp.getAuthor(), bp.getName()), bp) != null) {
            throw new BlueprintPersistenceException("The given blueprint already exists: " + bp);
        } else if (bp.getAuthor().isEmpty() || bp.getName().isEmpty()) {
            throw new BlueprintPersistenceException("The given blueprint hasn't author or name");
        } 
    }

    @Override
    public Blueprint getBlueprint(String author, String bprintname) throws BlueprintNotFoundException {

        Blueprint resp = blueprints.get(new Tuple<>(author, bprintname));

        if (resp == null) {
            throw new BlueprintNotFoundException("Error 404 NOT FOUND: trying to find blueprints");
        }

        return resp;
    }

    @Override
    public Set<Blueprint> getBlueprintsByAuthor(String author) throws BlueprintNotFoundException {
        Set<Blueprint> resp = new HashSet<>();

        for (Map.Entry<Tuple<String, String>, Blueprint> space : blueprints.entrySet()) {
            if (space.getKey().getElem1().equals(author)) {
                resp.add(space.getValue());
            }
        }
        if (resp.isEmpty()) {
            throw new BlueprintNotFoundException("Error 404 NOT FOUND: trying to find blueprints");
        }
        return resp;

    }

    @Override
    public void updateBluePrint(String author, String name, Blueprint nbp) throws BlueprintPersistenceException {
        try {
            List<Point> aux2 = nbp.getPoints();
            if (aux2.isEmpty() || aux2 == null) {
                blueprints.remove(new Tuple<>(author, name));
                this.saveBlueprint(new Blueprint(nbp.getAuthor(), nbp.getName()));
            } else{
                Point[] aux = aux2.toArray(new Point[aux2.size()]);
                blueprints.remove(new Tuple<>(author, name));
                this.saveBlueprint(new Blueprint(nbp.getAuthor(), nbp.getName(), aux));
            }

            System.out.println("SI ME LLAMAN");

            

        } catch (BlueprintPersistenceException e) {
            throw new BlueprintPersistenceException(e.getMessage());
        }

    }
}
